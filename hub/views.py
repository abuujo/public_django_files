from django.shortcuts import get_object_or_404,render
from .models import Post
from taggit.models import Tag
from django.views.generic import (
    DetailView, ListView
)
# HUB VIEWS
def home(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'Home Page',
            'description' : 'Home page for my site.'
        },
	}
    return render(request, 'hub/home.html', context)

# Election 2022 pages

def election(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'Election 2022',
            'description' : 'Collection of information and visualisations for the 2022 election in Australia. '
        },
	}
    return render(request, 'hub/election/election.html', context)

def fn_polling(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'Election 2022 footnote - polling',
            'description' : 'Footnote from the main 2022 election page on polling and weighted polling.'
        },
	}
    return render(request, 'hub/election/fn_polling.html', context)

def fn_meckerras(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'Election 2022 footnote - Meckerras',
            'description' : 'Footnote from the main 2022 election page on Meckerras Pendulumn and how elections work.'
        },
	}
    return render(request, 'hub/election/fn_meckerras.html', context)

def fn_bellwether(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'Election 2022 footnote - Bellwether',
            'description' : 'Footnote from the main 2022 election page on bellwether seats.'
        },
	}
    return render(request, 'hub/election/fn_bellwether.html', context)

# NSW Covid Pages

def covid(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'NSW Covid',
            'description' : 'Showcasing the covid-19 virus in NSW.'
        },
	}
    return render(request, 'hub/covid/nswcovid.html', context)

def fn_public_transit(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'NSW Covid vs Public Transit',
            'description' : 'Footnote from the main NSW Covid Post.'
        },
	}
    return render(request, 'hub/covid/fn_public_transit.html', context)

def fn_postcode(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'View Your LGA From Your Postcode',
            'description' : 'Footnote from the main NSW Covid Post.'
        },
	}
    return render(request, 'hub/covid/fn_lga.html', context)


def chess(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'Simple Chess in JS',
            'description' : 'Play against a simple JS chess engine.'
        },
	}
    return render(request, 'hub/chess.html', context)


    
# Guides
def django_help(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'Django Help',
            'description' : 'Useful tips for working with Django'
        },
	}
    return render(request, 'hub/guides/django_help.html', context)

def react_help(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'React Help',
            'description' : 'Useful tips for working with React'
        },
	}
    return render(request, 'hub/guides/react_help.html', context)

def vba_scripts(request):
    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'VBA Scripts',
            'description' : 'My Favorite scripts for VBA'
        },
	}
    return render(request, 'hub/guides/vba_scripts.html', context)

# Blog
def blog(request):

    common_tags = Post.tags.most_common()[:3]
    posts = Post.objects.all().order_by('-date_posted')


    context = {
        # Can add more stuff here if necessary ( e.g. banner image change.)
        'meta' : {
            'title': 'Personal Blog',
            'description' : 'My personal blog for topics such as coding and rabbits'
        },
        'posts': posts,
        'common_tags' : common_tags,
	}
    return render(request, 'hub/blog.html', context)

class blog_post(DetailView):
    model = Post


def innertag(request, slug):
    print(slug)
    tags = Tag.objects.filter(slug=slug).values_list('name', flat=True)
    print(tags)
    posts_tag = Post.objects.filter(tags__name__in=tags)
    context = {'tag': slug, 'posts': posts_tag,  'return_to_blog': True,}
    return render(request, 'hub/blog.html', context)
