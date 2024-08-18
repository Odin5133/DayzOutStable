from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import loginInfo
from django.shortcuts import get_object_or_404
# Create your views here.

def login(request):
    template = loader.get_template('login.html')
    #print(request.POST)
    query_dict = request.POST
    user = query_dict.get('username')
    userobj = None
    if user is not None:
        userobj = get_object_or_404(loginInfo, username=user) # use try except block for custom template
        passw = query_dict.get('password')
        if userobj.password == passw:
            #print(userobj.password)
            return render(request, 'success.html')
        else:
            #incorrect pass
            return render(request, 'incorrectpass.html')
    return render(request, 'login.html')