from django.db import models
import uuid
from django.utils import timezone
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
# Create your models here.

class User(models.Model):
    email = models.EmailField(max_length=255, verbose_name="Email Address", blank=False, null=False, default="")
    password = models.CharField(max_length=255, verbose_name="Password", blank=False, null=False, default="")

    def __str__(self):
        return f"User: {self.email}"
    
    def GetUserByEmail(email):
        try:
            return User.objects.get(email=email)
        except:
            return False

class Events(models.Model):
    event_id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    event_image = models.ImageField(upload_to='event_images/', null=False)
    event_name = models.CharField(max_length=100, null=False)
    event_venue = models.CharField(max_length=100, null=False)
    event_date = models.DateField(null=False)
    event_description = models.TextField(null=False)

    def __str__(self):
        return f"Event Id: {self.event_id} and Event Name: {self.event_name}"

TRANSPORT_CHOICES = [
    ('flight', 'Flight'),
    ('train', 'Train'), 
    ('bus', 'Bus'),
    ('self', 'Self'),
]

IDENTIFICATION_CHOICES = [
    ('aadhar', 'Aadhar Card'),
    ('passport', 'Passport'),
    ('license', 'Driving License'),
]

# Model for Event Registration
class EventRegistration(models.Model):
    event = models.ForeignKey(Events, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255, verbose_name="Full Name", blank=False, null=False, default="")
    country_code = models.CharField(
        max_length=4,
        validators=[
            RegexValidator(regex=r'^\+\d{1,3}$', message='Country code must start with "+" and contain up to 3 digits.')
        ],
        verbose_name="Country Code",
        blank=False,
        null=False,
        default="+91"
    )
    mobile_number = models.CharField(max_length=15, verbose_name="Mobile Number", blank=False, null=False, default="")
    email = models.EmailField(max_length=255, verbose_name="Email Address", blank=False, null=False, default="")
    flag_attending = models.CharField(
        max_length=50,
        choices=[
            ('yes', 'Yes, I will attend the event'),
            ('no', "Sorry, I can't attend the event"),
        ],
        verbose_name="Will you attend?",
        blank=False,
        null=False,
        default='no'
    )
    number_of_people = models.PositiveIntegerField(
        default=0,
        verbose_name="Number of People Attending",
        help_text="Fill only if attending"
    )
    remarks = models.TextField(
        blank=True,
        null=True,
        verbose_name="Remarks",
        help_text="Optional field for additional remarks."
    )
    arrival_transport = models.CharField(
        max_length=50,
        choices=[
            ('flight', 'Flight'),
            ('train', 'Train'),
            ('bus', 'Bus'),
            ('self', 'Self'),
        ],
        verbose_name="Arrival Transport",
        blank=True,
        null=True
    )
    departure_transport = models.CharField(
        max_length=50,
        choices=[
            ('flight', 'Flight'),
            ('train', 'Train'),
            ('bus', 'Bus'),
            ('self', 'Self'),
        ],
        verbose_name="Departure Transport",
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.name} - {self.mobile_number}"

# Model for Participants (if attending)
class Attendee(models.Model):
    registration = models.ForeignKey(
        EventRegistration, on_delete=models.CASCADE, related_name='attendees'
    )
    name = models.CharField(max_length=255, verbose_name="Participant Name", blank=False, null=False, default="")
    mobile_number = models.CharField(max_length=15, verbose_name="Participant Mobile Number", blank=False, null=False, default="")
    identification_proof = models.CharField(
        max_length=50,
        choices=IDENTIFICATION_CHOICES,
        verbose_name="Identification Proof",
        blank=False,
        null=False,
        default='aadhar'  # Default value from IDENTIFICATION_CHOICES
    )

    def __str__(self):
        return f"Participant: {self.name} (for {self.registration.name})"

# Model for Transport Details
class TransportDetails(models.Model):
    registration = models.ForeignKey(
        EventRegistration, on_delete=models.CASCADE, related_name='transport_details'
    )
    mode_of_transport = models.CharField(max_length=10, choices=TRANSPORT_CHOICES, verbose_name="Mode of Transport", blank=False, null=False, default='self')
    
    # Fields for flight transport
    flight_number = models.CharField(
        max_length=50,
        verbose_name="Flight Number",
        help_text="Required if mode of transport is flight",
        blank=True,
        null=True
    )
    terminal_name = models.CharField(
        max_length=100,
        verbose_name="Terminal Name",
        help_text="Required if mode of transport is flight",
        blank=True,
        null=True
    )

    # Fields for train transport
    train_number = models.CharField(
        max_length=50,
        verbose_name="Train Number",
        help_text="Required if mode of transport is train",
        blank=True,
        null=True
    )
    train_arrival_station = models.CharField(
        max_length=100,
        verbose_name="Train Arrival Station",
        help_text="Required if mode of transport is train",
        blank=True,
        null=True
    )

    # Fields for bus transport
    bus_number = models.CharField(
        max_length=50,
        verbose_name="Bus Number",
        help_text="Optional for bus transport",
        blank=True,
        null=True
    )
    bus_stop = models.CharField(
        max_length=100,
        verbose_name="Bus Stop",
        help_text="Required if mode of transport is bus",
        blank=True,
        null=True
    )

    # Date/time fields
    arrival_date = models.DateTimeField(verbose_name="Arrival Date/Time", blank=True, null=True)
    departure_date = models.DateTimeField(verbose_name="Departure Date/Time", blank=True, null=True)

    def clean(self):
        """Custom validation for transport-specific fields"""
        if self.mode_of_transport == 'flight' and not (self.flight_number and self.terminal_name):
            raise ValidationError("Flight number and terminal name are required for flights.")
        if self.mode_of_transport == 'train' and not (self.train_number and self.train_arrival_station):
            raise ValidationError("Train number and arrival station are required for trains.")
        if self.mode_of_transport == 'bus' and not self.bus_stop:
            raise ValidationError("Bus stop is required for buses.")

    def __str__(self):
        return f"Transport ({self.mode_of_transport}) for {self.registration.name}"
