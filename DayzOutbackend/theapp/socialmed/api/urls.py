from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, SuggestedFriends, SearchUserDropdown, Unfriend, MyFriends, EditEmail, EditPostBody, EditPostImage, EditPostTitle, EditProfilePic, EditProfileBio, EditProfileBanner, EditUsername, PostSearchView, EditPassword, AcceptFriendRequest, SendFriendRequest, DeclineFriendRequest, LikePostView, PendingFriendRequests, DislikePostView, LoginView, UserView, LogoutView, RefreshView, ProfileView, CreatePostView, FeedView
from django.conf.urls.static import static
from django.conf import settings
from django.views.static import serve
#from .views import login_view

#login_router = DefaultRouter()
#login_router.register('login', LoginInfoViewSet, basename='login')

# Include the router's URLs into the urlpatterns
urlpatterns = [
    #path('', include(login_router.urls)),
 #   path('verify/', login_view, name='verify'),
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/', UserView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('refresh/', RefreshView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('createPost/', CreatePostView.as_view()),
    #path('reactPost/', ReactPostView.as_view()),
    path('feed/', FeedView.as_view()),
    path('likePost/', LikePostView.as_view()),
    path('dislikePost/', DislikePostView.as_view()),
    path('pendingRequests/', PendingFriendRequests.as_view()),
    path('acceptFriendRequest/', AcceptFriendRequest.as_view()), # friend request id
    path('declineFriendRequest/', DeclineFriendRequest.as_view()), # friend request id
    path('sendFriendRequest/', SendFriendRequest.as_view()), # to_username
    path('unfriend/', Unfriend.as_view()), # friend_username
    path('myFriends/', MyFriends.as_view()), 
    #path('userposts/search/', PostSearchView.as_view(), name='userposts-search'),
    path('editPassword/', EditPassword.as_view()), # old_password, password
    path('editUsername/', EditUsername.as_view()), # username
    path('editEmail/', EditEmail.as_view()), # email
    path('editProfileBio/', EditProfileBio.as_view()), # bio
    path('editProfilePic/', EditProfilePic.as_view()), # request.FILES['profilePic']
    path('editProfileBanner/', EditProfileBanner.as_view()), # request.FILES['profileBanner']
    path('editPostImage/', EditPostImage.as_view()), # request.FILES['new_postpic']
    path('editPostBody/', EditPostBody.as_view()), # body
    path('editPostTitle/', EditPostTitle.as_view()), # title
    path('suggestedFriends/', SuggestedFriends.as_view()), 
    path('searchUserDropdown/', SearchUserDropdown.as_view()), #userField
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')), #password_reset/ -> email; password_reset/confirm/ -> token, password; password_reset/validate_token/ -> token 
]
