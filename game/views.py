from django.http import HttpResponse
def index(request):
    line1 = '<h1 style="text-align:center;">Backrooms Ordeal</h1>'
    line2 = '<img width="100%" src="https://pbs.twimg.com/media/FROzUkdaIAAU0P4?format=jpg&name=4096x4096"></img>'
    return HttpResponse(line1+line2)
