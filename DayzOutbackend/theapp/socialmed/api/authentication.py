import jwt, datetime
from rest_framework import exceptions
def create_access_token(id):
    return jwt.encode({
        'user_id': id,
        'exp': datetime.datetime.utcnow()+datetime.timedelta(minutes=20),
        'iat': datetime.datetime.utcnow()
    }, 'access_secret', algorithm='HS256')


def create_refresh_token(id):
    return jwt.encode({
        'user_id': id,
        'exp': datetime.datetime.utcnow()+datetime.timedelta(minutes=30),
        'iat': datetime.datetime.utcnow(),
        #'allowed_resources': ['__all__']
    }, 'refresh_secret', algorithm='HS256')


def decode_access_token(token):
    try:
        payload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed('Token has expired')
    except jwt.InvalidTokenError:
        raise exceptions.AuthenticationFailed('Invalid token')
    except Exception as e:
        raise exceptions.AuthenticationFailed(f'Unauthenticated! {str(e)}')
    

def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, 'refresh_secret', algorithms=['HS256'])
        return payload['user_id']
    except:
        raise exceptions.AuthenticationFailed('Unauthenticated!')