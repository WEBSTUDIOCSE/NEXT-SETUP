'use client';

import { useAuth } from '@/contexts/AuthContext';
import { APIBook } from '@/lib/firebase/services';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Mail, User, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function UserProfile() {
  const { user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError('');
    
    const result = await APIBook.auth.signOut();
    if (!result.success) {
      setLogoutError(result.error || 'Logout failed');
      setLoggingOut(false);
    }
    // If successful, the auth context will handle the state change
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {logoutError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{logoutError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback className="text-lg">
                  {user.displayName ? getInitials(user.displayName) : 
                   user.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {user.displayName || 'Anonymous User'}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              variant="outline"
              size="sm"
            >
              {loggingOut ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Verification</span>
              <Badge variant={user.emailVerified ? "default" : "secondary"}>
                {user.emailVerified ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </>
                ) : (
                  <>
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Unverified
                  </>
                )}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">User ID:</span>
                <span className="text-sm text-muted-foreground font-mono">{user.uid}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Account Created:</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(user.metadata.creationTime)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Sign In:</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(user.metadata.lastSignInTime)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Provider</p>
                <p className="text-sm text-muted-foreground">
                  {user.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email/Password'}
                </p>
              </div>
              <Badge variant="outline">
                {user.providerData[0]?.providerId === 'google.com' ? 'OAuth' : 'Email'}
              </Badge>
            </div>

            {!user.emailVerified && user.providerData[0]?.providerId !== 'google.com' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please verify your email address to secure your account. Check your inbox for a verification email.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
