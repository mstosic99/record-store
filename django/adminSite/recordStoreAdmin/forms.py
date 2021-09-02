from django.forms import ModelForm, Form
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
import django.forms as forms
from .models import Records


class RecordForm(ModelForm):
    class Meta:
        model = Records
        fields = ["title", "price", "stock", "genre", "artist", "year", "image"]


class OrderForm(forms.Form):
    order_id = forms.IntegerField()
