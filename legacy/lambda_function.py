import pymysql
import os
import sys
import json
from datetime import datetime

try:
    conn = pymysql.connect(
        host=os.environ['DB_HOST'],
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASS'],
        db=os.environ['DB_NAME'],
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
except pymysql.MySQLError as e:
    sys.exit()
    
def api_get(payload):
    if 'fun' in payload:
        fun = payload['fun']
        if fun == 'review' and 'brand' in payload and 'product' in payload:
            brand = payload['brand']
            product = payload['product']
            try:
                with conn.cursor() as cur:
                    cur.execute('SELECT ROUND(AVG(rate), 0) AS rate, ROUND(AVG(rate1), 0) AS rate1, ' + \
                                'ROUND(AVG(rate2), 0) AS rate2, ROUND(AVG(rate3), 0) AS rate3, ' + \
                                'ROUND(AVG(rate4), 0) AS rate4, ROUND(AVG(rate5), 0) AS rate5, ' + \
                                'ROUND(AVG(rate6), 0) AS rate6 ' + \
                                'FROM reviews WHERE brand=%s AND product=%s AND shown=%s;',
                                (brand, product, True)
                                )
                    ratings = cur.fetchone()
                    cur.execute('SELECT reviews.*, users.uname, users.uavatar, users.youtube, users.approved ' + \
                                'FROM reviews LEFT JOIN users ON reviews.user=users.id ' + \
                                'WHERE brand=%s AND product=%s AND shown=%s ORDER BY reviews.user DESC;',
                                (brand, product, True)
                                )
                    reviews = cur.fetchall()
                    return (None, { 'ratings': ratings, 'reviews': reviews })
            except (pymysql.Warning, pymysql.Error, pymysql.InterfaceError, pymysql.DatabaseError, 
                    pymysql.DataError, pymysql.OperationalError, pymysql.IntegrityError, pymysql.InternalError, 
                    pymysql.ProgrammingError, pymysql.NotSupportedError) as e:
                return (e,)
        elif fun == 'most_recent':
            try:
                with conn.cursor() as cur:
                    cur.execute('SELECT reviews.*, users.uname, users.uavatar, users.youtube, users.approved ' +
                                'FROM reviews LEFT JOIN users ON reviews.user=users.id ' +
                                'WHERE reviews.user IS NOT NULL AND reviews.shown=True ' +
                                'GROUP BY reviews.brand, reviews.product ORDER BY date_rev DESC LIMIT 6;')
                    reviews = cur.fetchall()
                    return (None, reviews)
            except (pymysql.Warning, pymysql.Error, pymysql.InterfaceError, pymysql.DatabaseError, 
                    pymysql.DataError, pymysql.OperationalError, pymysql.IntegrityError, pymysql.InternalError, 
                    pymysql.ProgrammingError, pymysql.NotSupportedError) as e:
                return (e,)
        elif fun == 'seeking_approval':
            try:
                with conn.cursor() as cur:
                    cur.execute('SELECT ROUND(AVG(rate), 0) AS rate, ROUND(AVG(rate1), 0) AS rate1, ' +
                                'ROUND(AVG(rate2), 0) AS rate2, ROUND(AVG(rate3), 0) AS rate3, ' +
                                'ROUND(AVG(rate4), 0) AS rate4, ROUND(AVG(rate5), 0) AS rate5, ' +
                                'ROUND(AVG(rate6), 0) AS rate6 FROM reviews WHERE shown=False;')
                    ratings = cur.fetchone()
                    cur.execute('SELECT reviews.*, users.uname, users.uavatar, users.youtube, users.approved ' +
                                'FROM reviews LEFT JOIN users ON reviews.user=users.id WHERE shown=False ' +
                                'ORDER BY reviews.user DESC;')
                    reviews = cur.fetchall()
                    return (None, { 'ratings': ratings, 'reviews': reviews })
            except (pymysql.Warning, pymysql.Error, pymysql.InterfaceError, pymysql.DatabaseError, 
                    pymysql.DataError, pymysql.OperationalError, pymysql.IntegrityError, pymysql.InternalError, 
                    pymysql.ProgrammingError, pymysql.NotSupportedError) as e:
                return (e,)
        elif fun == 'posts':
            try:
                with conn.cursor() as cur:
                    cur.execute('SELECT posts.*, users.uname, users.uavatar ' +
                                'FROM posts LEFT JOIN users ON posts.user=users.id;')
                    posts = cur.fetchall()
                    return (None, posts)
            except (pymysql.Warning, pymysql.Error, pymysql.InterfaceError, pymysql.DatabaseError, 
                    pymysql.DataError, pymysql.OperationalError, pymysql.IntegrityError, pymysql.InternalError, 
                    pymysql.ProgrammingError, pymysql.NotSupportedError) as e:
                return (e,)
        else:
            return (ValueError('Unsupported fun "{}" or missing arguments'.format(fun)),)
    else:
        return (ValueError('Missing argument "fun"'),)
        
def api_post(payload):
    if 'fun' in payload:
        fun = payload['fun']
        if fun == 'review' and 'review' in payload:
            review = payload['review']
            try:
                with conn.cursor() as cur:
                    if review['user'] is not None:
                        sql = 'INSERT INTO users (id, uname, uavatar) VALUES(%s, %s, %s) ' + \
                              'ON DUPLICATE KEY UPDATE uname=VALUES(uname), uavatar=VALUES(uavatar);'
                        val = (review['user'], review['uname'], review['uavatar'])
                        cur.execute(sql, val)
                        conn.commit()
                        sql = 'SELECT COUNT(*) AS count FROM reviews WHERE user=%s GROUP BY user;'
                        val = (review['user'])
                        cur.execute(sql, val)
                        result = cur.fetchone()
                        count = result['count'] if result is not None else 0
                        if count < 2:
                            sql = 'INSERT INTO reviews (user, brand, product, date_rev, date_buy, pros, cons, rate, ' \
                                + 'rate1, rate2, rate3, rate4, rate5, rate6, shown, brand_pros, brand_cons, brand_rate) ' \
                                + 'VALUES (%s, %s, %s, %s, STR_TO_DATE(%s, "%%Y-%%m"), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
                            val = (review['user'], review['brand'], review['product'], datetime.utcnow().strftime('%Y-%m-%d'),
                                   review['date_buy'], review['pros'], review['cons'], review['rate'], review['rate1'],
                                   review['rate2'], review['rate3'], review['rate4'], review['rate5'], review['rate6'],
                                   False, review['brand_pros'], review['brand_cons'], review['brand_rate'])
                            cur.execute(sql, val)
                            conn.commit()
                            return (None, { 'ok': True, 'message': 'تم نشر المراجعة. بانتظار الموافقة.' })
                        else:
                            return (None, { 'ok': False, 'message': 'لا يمكن نشر أكثر من مراجعتين' })
                    else:
                        sql = 'INSERT INTO reviews (brand, product, date_rev, date_buy, pros, cons, rate, ' \
                            + 'rate1, rate2, rate3, rate4, rate5, rate6, shown, brand_pros, brand_cons, brand_rate) ' \
                            + 'VALUES (%s, %s, %s, STR_TO_DATE(%s, "%%Y-%%m"), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'
                        val = (review['brand'], review['product'], datetime.utcnow().strftime('%Y-%m-%d'),
                               review['date_buy'], review['pros'], review['cons'], review['rate'], review['rate1'],
                               review['rate2'], review['rate3'], review['rate4'], review['rate5'], review['rate6'],
                               False, review['brand_pros'], review['brand_cons'], review['brand_rate'])
                        cur.execute(sql, val)
                        conn.commit()
                        return (None, { 'ok': True, 'message': 'تم نشر المراجعة. بانتظار الموافقة.' })
            except (pymysql.Warning, pymysql.Error, pymysql.InterfaceError, pymysql.DatabaseError, 
                    pymysql.DataError, pymysql.OperationalError, pymysql.IntegrityError, pymysql.InternalError, 
                    pymysql.ProgrammingError, pymysql.NotSupportedError) as e:
                return (e,)
        elif fun == 'user' and 'user' in payload:
            user = payload['user']
            try:
                with conn.cursor() as cur:
                    sql = 'INSERT INTO users (id, uname, email, uavatar, youtube, twitter, facebook, approved) ' + \
                          'VALUES(%s, %s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE ' + \
                          'uname=VALUES(uname), email=VALUES(email), uavatar=VALUES(uavatar), ' + \
                          'youtube=VALUES(youtube), twitter=VALUES(twitter), ' + \
                          'facebook=VALUES(facebook), approved=VALUES(approved);'
                    val = (user['uid'], user['uname'], user['uemail'], user['uavatar'], user['youtube'],
                           user['twitter'] if 'twitter' in user else None,
                           user['facebook'] if 'facebook' in user else None, False)
                    cur.execute(sql, val)
                conn.commit()
                return (None, { 'ok': True })
            except (pymysql.Warning, pymysql.Error, pymysql.InterfaceError, pymysql.DatabaseError, 
                    pymysql.DataError, pymysql.OperationalError, pymysql.IntegrityError, pymysql.InternalError, 
                    pymysql.ProgrammingError, pymysql.NotSupportedError) as e:
                return (e,)
        elif fun == 'post' and 'post' in payload:
            post = payload['post']
            try:
                with conn.cursor() as cur:
                    sql = 'INSERT INTO users (id, uname, uavatar) VALUES(%s, %s, %s) ' + \
                          'ON DUPLICATE KEY UPDATE uname=VALUES(uname), uavatar=VALUES(uavatar);'
                    val = (post['user'], post['uname'], post['uavatar'])
                    cur.execute(sql, val)
                    conn.commit()
                    sql = 'SELECT approved FROM users WHERE id=%s;'
                    val = post['user']
                    cur.execute(sql, val)
                    result = cur.fetchone()
                    approved = result['approved'] if result is not None else False
                    if approved == True:
                        sql = 'INSERT INTO posts (user, tag, date_post, thumbnail, title, content, rate) ' \
                            + 'VALUES (%s, %s, %s, %s, %s, %s, %s);'
                        val = (post['user'], post['tag'], datetime.utcnow().strftime('%Y-%m-%d'),
                               post['thumbnail'], post['title'], post['content'], post['rate'])
                        cur.execute(sql, val)
                        conn.commit()
                        return (None, { 'ok': True, 'message': 'تم نشر المقال' })
                    else:
                        return (None, { 'ok': False, 'message': 'لا تملك صلاحية النشر' })
            except (pymysql.Warning, pymysql.Error, pymysql.InterfaceError, pymysql.DatabaseError, 
                    pymysql.DataError, pymysql.OperationalError, pymysql.IntegrityError, pymysql.InternalError, 
                    pymysql.ProgrammingError, pymysql.NotSupportedError) as e:
                return (e,)
        elif fun == 'approve' and 'id' in payload:
            id = payload['id']
            try:
                with conn.cursor() as cur:
                    sql = 'UPDATE reviews SET shown=%s WHERE id=%s;'
                    val = (True, id)
                    cur.execute(sql, val)
                conn.commit()
                return (None, { 'ok': True, 'message': 'تمت الموافقة' })
            except (pymysql.Warning, pymysql.Error, pymysql.InterfaceError, pymysql.DatabaseError, 
                    pymysql.DataError, pymysql.OperationalError, pymysql.IntegrityError, pymysql.InternalError, 
                    pymysql.ProgrammingError, pymysql.NotSupportedError) as e:
                return (e,)
        elif fun == 'delete' and 'id' in payload:
            id = payload['id']
            try:
                with conn.cursor() as cur:
                    sql = 'DELETE FROM reviews WHERE id=%s;'
                    val = (id)
                    cur.execute(sql, val)
                conn.commit()
                return (None, { 'ok': True, 'message': 'تم المسح' })
            except (pymysql.Warning, pymysql.Error, pymysql.InterfaceError, pymysql.DatabaseError, 
                    pymysql.DataError, pymysql.OperationalError, pymysql.IntegrityError, pymysql.InternalError, 
                    pymysql.ProgrammingError, pymysql.NotSupportedError) as e:
                return (e,)
        else:
            return (ValueError('Unsupported fun "{}" or missing arguments'.format(fun)),)
    else:
        return (ValueError('Missing argument "fun"'),)

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': str(err) if err else json.dumps(res, default=str),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        }
    }
    
def lambda_handler(event, context):
    print('Received event: ' + json.dumps(event, indent=2))

    operations = {
        'DELETE': api_post,
        'GET': api_get,
        'POST': api_post,
        'PUT': api_get,
    }

    operation = event['httpMethod']
    if operation in operations:
        payload = event['queryStringParameters'] if operation == 'GET' else json.loads(event['body'])
        return respond(*operations[operation](payload))
    else:
        return respond(ValueError('Unsupported method "{}"'.format(operation)))
