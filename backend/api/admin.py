from django.contrib import admin
from .models import EmailDetection, SuggestedAction, ThreatHistory, VulnerableAccount

@admin.register(SuggestedAction)
class SuggestedActionAdmin(admin.ModelAdmin):
    list_display = ('action_id', 'action_type', 'user')
    search_fields = ('action_type', 'action_statement')
    list_filter = ('action_type',)

@admin.register(VulnerableAccount)
class VulnerableAccountAdmin(admin.ModelAdmin):
    list_display = ('account_id', 'vulnerability_level', 'user', 'last_detected')
    search_fields = ('account_id',)
    list_filter = ('vulnerability_level',)

@admin.register(EmailDetection)
class EmailDetectionAdmin(admin.ModelAdmin):
    list_display = ('email_id', 'from_email', 'to', 'subject', 'user')
    search_fields = ('email_id', 'subject', 'content')
    list_filter = ('from_email', 'to')

@admin.register(ThreatHistory)
class ThreatHistoryAdmin(admin.ModelAdmin):
    list_display = ('threat_id', 'threat_type', 'threat_severity', 'detection_time', 'user')
    search_fields = ('threat_type', 'threat_severity')
    list_filter = ('threat_type', 'threat_severity')
