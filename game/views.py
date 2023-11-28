from django.http import HttpResponse
def index(request):
    line1 = '<h1 style="text-align:center;">涟漪今天吃什么</h1>'
    return HttpResponse(line1)
