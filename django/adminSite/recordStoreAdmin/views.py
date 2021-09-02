from django.shortcuts import get_object_or_404, render, redirect
from django.http import Http404
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, permission_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from .models import Genres, Artists, Records, Orders, Carts, Users
from .forms import RecordForm, OrderForm
from django.contrib.auth import login
import jwt


def index(request, token):
    admin = is_admin(token)
    # if is_admin(token):
    order_list = Orders.objects.filter(status="0")
    if request.method == "POST":
        form = OrderForm(data=request.POST)

        if form.is_valid():
            orderId = form.cleaned_data["order_id"]
            items = Carts.objects.filter(order=orderId)
            for item in items:
                record = Records.objects.get(pk=item.record_id)
                record.stock = record.stock - item.quantity
                record.save(update_fields=["stock"])
            order = Orders.objects.get(pk=orderId)
            order.status = 1
            order.save()
            return redirect("/" + token)
        else:
            return render(
                request,
                "recordStoreAdmin/index.html",
                {
                    "form": form,
                    "order_list": order_list,
                    "token": token,
                    "error": form.errors.items,
                },
            )
    else:
        form = OrderForm()
        return render(
            request,
            "recordStoreAdmin/index.html",
            {"form": form, "token": token, "order_list": order_list},
        )


# else:
#   return HttpResponse("Forbidden")


def add_record(request, token):
    # if is_admin(token):
    genre_list = Genres.objects.all()
    artist_list = Artists.objects.all()
    if request.method == "POST":
        form = RecordForm(request.POST)

        if form.is_valid():
            r = Records(
                title=form.cleaned_data["title"],
                stock=form.cleaned_data["stock"],
                price=form.cleaned_data["price"],
                genre=form.cleaned_data["genre"],
                artist=form.cleaned_data["artist"],
                year=form.cleaned_data["year"],
                image=form.cleaned_data["image"],
            )
            r.save()
            return redirect("/add_record/" + token)
        else:
            return render(
                request,
                "recordStoreAdmin/add_record.html",
                {
                    "form": form,
                    "token": token,
                    "genre_list": genre_list,
                    "artist_list": artist_list,
                    "error": form.errors.items,
                },
            )
    else:
        form = RecordForm()
        return render(
            request,
            "recordStoreAdmin/add_record.html",
            {
                "form": form,
                "token": token,
                "genre_list": genre_list,
                "artist_list": artist_list,
            },
        )
    # else:
    #   return HttpResponse("Forbidden")


def is_admin(token):
    try:
        decoded = jwt.decode(token, "osecamgolasi")
        print(
            decoded
            + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        )
        u = Users.objects.get(pk=decoded["user_id"])
        if u.admin == 1:
            return True
        return False
    except:
        return False