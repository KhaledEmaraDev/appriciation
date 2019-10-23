import lscache from "lscache";

const TTL_MINUTES = 5;

export default async function(url, options) {
  if (typeof window === "undefined") {
    return fetch(url, options).then(response => response.json());
  }

  let cachedResponse = lscache.get(url);

  if (cachedResponse === null) {
    cachedResponse = await fetch(url, options).then(response =>
      response.json()
    );
    lscache.set(url, cachedResponse, TTL_MINUTES);
  }

  return cachedResponse;
}

export function overrideCache(key, val) {
  lscache.set(key, val, TTL_MINUTES);
}
