import React from "react";
import deburr from "lodash/deburr";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/SearchRounded";
import { makeStyles } from "@material-ui/core/styles";

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <div>
      <InputBase
        className={classes.searchBar}
        fullWidth
        startAdornment={
          <InputAdornment className={classes.inputAdornment} position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        }
        inputRef={node => {
          ref(node);
          inputRef(node);
        }}
        classes={{
          input: classes.input
        }}
        {...other}
      />
    </div>
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const label = `${suggestion.brand} ${suggestion.product}`;
  const matches = match(label, query);
  const parts = parse(label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 500 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion) {
  return `${suggestion.brand} ${suggestion.product}`;
}

const useStyles = makeStyles(theme => ({
  searchBar: {
    borderRadius: "100px",
    backgroundColor: theme.palette.grey["200"],
    "&:hover": {
      backgroundColor: theme.palette.grey["100"]
    },
    "&:focus-within": {
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`
    }
  },
  inputAdornment: {
    marginLeft: theme.spacing(1)
  },
  input: {
    padding: theme.spacing(1.25, 0, 0.75, 0)
  },
  container: {
    position: "relative",
    flexGrow: 1
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  }
}));

export default function SearchBar(props) {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);

  const handleSuggestionsFetchRequested = ({ value }) => {
    const inputValue = deburr(value.trim()).toLowerCase();
    if (inputValue.length === 0) return setSuggestions([]);
    fetch(`http://localhost:3000/api/search?query=${inputValue}`)
      .then(res => res.json())
      .then(json => setSuggestions(json));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleChange = (event, { newValue }) => {
    setInputValue(newValue);
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: suggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    onSuggestionSelected: (event, { suggestion }) => {
      setInputValue("");
      props.handleSuggestionSelected(suggestion);
    },
    getSuggestionValue,
    renderSuggestion,
    focusInputOnSuggestionClick: false
  };

  return (
    <Autosuggest
      {...autosuggestProps}
      inputProps={{
        classes,
        id: props.id,
        placeholder: props.placeholder,
        value: inputValue,
        onChange: handleChange,
        onFocus: props.onFocus,
        onBlur: props.onBlur
      }}
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion
      }}
      renderSuggestionsContainer={options => (
        <Paper {...options.containerProps}>{options.children}</Paper>
      )}
    />
  );
}

SearchBar.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  handleSuggestionSelected: PropTypes.func
};
