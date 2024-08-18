from rest_framework.authentication import get_authorization_header
from ..api.authentication import decode_access_token
from ..models import User
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from ..api.serializers import UserSerializer

class UserDecoder:
  def __init__(self, get_response):
    self.get_response = get_response
    # One-time configuration and initialization.

  def __call__(self, request):
    # Code to be executed for each request before
    # the view (and later middleware) are called.
    auth = get_authorization_header(request).split()
    user = None

    if auth and len(auth) == 2:
      token = auth[1].decode('utf-8')
      id = decode_access_token(token)
      user = User.objects.filter(pk=id).first()
      response = self.get_response(request, user)

      return response
    raise AuthenticationFailed('Unauthenticated!aaaaa')


# CSRF Cookie not provided error...........?
# Tried disabling CSRF in settings.py, tried using csrf_exempt decorator on views to no avail

# from rest_framework.authentication import get_authorization_header
# from ..api.authentication import decode_access_token
# from ..models import User
# from rest_framework.exceptions import AuthenticationFailed

# class UserDecoder:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         auth = get_authorization_header(request).split()
#         user = None

#         if auth and len(auth) == 2:
#             try:
#                 token = auth[1].decode('utf-8')
#                 user_id = decode_access_token(token)
#                 user = User.objects.filter(pk=user_id).first()
#                 if user:
#                     request.user = user  # Attach the user to the request object
#                 else:
#                     raise AuthenticationFailed('User not found.')
#             except Exception as e:
#                 raise AuthenticationFailed(f'Unauthenticated! Error: {str(e)}')
#         else:
#             raise AuthenticationFailed('Invalid token header. No credentials provided.')

#         # Continue processing the request
#         response = self.get_response(request)

#         return response
