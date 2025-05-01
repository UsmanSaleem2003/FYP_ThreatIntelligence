from django.db import models
from django.contrib.auth.models import User

# SuggestedAction Model
class SuggestedAction(models.Model):
    action_id = models.CharField(max_length=255)
    action_type = models.CharField(max_length=255)
    action_statement = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='suggested_actions')

    def __str__(self):
        return self.action_type

# VulnerableAccount Model
class VulnerableAccount(models.Model):
    account_id = models.CharField(max_length=255)
    vulnerability_level = models.CharField(max_length=100)
    last_detected = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vulnerable_accounts')
    action = models.ForeignKey(SuggestedAction, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.account_id

# EmailDetection Model
class EmailDetection(models.Model):
    email_id = models.CharField(max_length=255)
    from_email = models.EmailField()
    to = models.EmailField()
    cc_bcc = models.JSONField(default=list, blank=True)
    subject = models.CharField(max_length=255)
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_detections')

    def __str__(self):
        return self.subject

# ThreatHistory Model
class ThreatHistory(models.Model):
    threat_id = models.CharField(max_length=255)
    threat_type = models.CharField(max_length=100)
    threat_severity = models.CharField(max_length=50)
    detection_time = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='threat_histories')
    suggested_actions = models.ManyToManyField(SuggestedAction, blank=True)

    def __str__(self):
        return self.threat_type
