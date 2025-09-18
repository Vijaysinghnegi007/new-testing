'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  CreditCard,
  MapPin,
  AlertCircle,
  Gift,
  Settings,
  Clock,
  Moon,
  Save,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-toastify';

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      if (response.ok) {
        setHasChanges(false);
        toast.success('Notification preferences saved successfully');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchPreferences();
    setHasChanges(false);
  };

  const updatePreference = (type, field, value) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.type === type 
          ? { ...pref, [field]: value }
          : pref
      )
    );
    setHasChanges(true);
  };

  const toggleChannel = (type, channel) => {
    setPreferences(prev => 
      prev.map(pref => {
        if (pref.type === type) {
          const channels = [...pref.channels];
          if (channels.includes(channel)) {
            return { ...pref, channels: channels.filter(c => c !== channel) };
          } else {
            return { ...pref, channels: [...channels, channel] };
          }
        }
        return pref;
      })
    );
    setHasChanges(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'BOOKING':
        return <Calendar className="h-5 w-5 text-green-600" />;
      case 'TOUR':
        return <MapPin className="h-5 w-5 text-purple-600" />;
      case 'PAYMENT':
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case 'SYSTEM':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'PROMOTION':
        return <Gift className="h-5 w-5 text-orange-600" />;
      case 'MESSAGE':
        return <MessageSquare className="h-5 w-5 text-indigo-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeDescription = (type) => {
    switch (type) {
      case 'BOOKING':
        return 'Updates about your bookings, confirmations, and changes';
      case 'TOUR':
        return 'New tours, tour updates, and availability changes';
      case 'PAYMENT':
        return 'Payment confirmations, receipts, and billing updates';
      case 'SYSTEM':
        return 'Important system announcements and maintenance updates';
      case 'PROMOTION':
        return 'Special offers, discounts, and promotional content';
      case 'MESSAGE':
        return 'Chat messages and direct communications';
      default:
        return '';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'PUSH':
        return <Bell className="h-4 w-4" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'SMS':
        return <Smartphone className="h-4 w-4" />;
      case 'IN_APP':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Loading your notification preferences...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Customize how and when you receive notifications
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={saving}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              size="sm"
            >
              {saving ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {preferences.map((pref) => (
          <div key={pref.id} className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(pref.type)}
                <div>
                  <h3 className="font-medium">
                    {pref.type.charAt(0) + pref.type.slice(1).toLowerCase()} Notifications
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getTypeDescription(pref.type)}
                  </p>
                </div>
              </div>
              <Switch
                checked={pref.enabled}
                onCheckedChange={(checked) => updatePreference(pref.type, 'enabled', checked)}
              />
            </div>

            {pref.enabled && (
              <>
                <Separator />
                
                {/* Channels */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Notification Channels
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {['PUSH', 'EMAIL', 'IN_APP'].map((channel) => (
                      <Badge
                        key={channel}
                        variant={pref.channels.includes(channel) ? "default" : "outline"}
                        className="cursor-pointer flex items-center gap-1 px-3 py-1"
                        onClick={() => toggleChannel(pref.type, channel)}
                      >
                        {getChannelIcon(channel)}
                        {channel === 'IN_APP' ? 'In-App' : channel.charAt(0) + channel.slice(1).toLowerCase()}
                        {pref.channels.includes(channel) && (
                          <CheckCircle2 className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Frequency
                    </Label>
                    <Select
                      value={pref.frequency || 'immediate'}
                      onValueChange={(value) => updatePreference(pref.type, 'frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quiet Hours */}
                  {pref.channels.includes('PUSH') && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                        <Moon className="h-4 w-4" />
                        Quiet Hours
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={pref.quietHours?.start || '22:00'}
                          onChange={(e) => updatePreference(pref.type, 'quietHours', {
                            ...pref.quietHours,
                            start: e.target.value
                          })}
                          className="w-24"
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <Input
                          type="time"
                          value={pref.quietHours?.end || '08:00'}
                          onChange={(e) => updatePreference(pref.type, 'quietHours', {
                            ...pref.quietHours,
                            end: e.target.value
                          })}
                          className="w-24"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        No push notifications during these hours
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                About Notification Channels
              </h4>
              <ul className="mt-2 space-y-1 text-blue-700 dark:text-blue-200">
                <li><strong>Push:</strong> Real-time browser notifications</li>
                <li><strong>Email:</strong> Email notifications to your registered email</li>
                <li><strong>In-App:</strong> Notifications shown only within the app</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
