
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

const profileSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  avatar_url: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      avatar_url: '',
    },
  });

  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfile(data);
          form.reset({
            username: data.username || '',
            avatar_url: data.avatar_url || '',
          });
        }
      } catch (error: any) {
        toast.error('Error fetching profile: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
    
    getProfile();
  }, [user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const updates = {
        id: user.id,
        username: values.username,
        avatar_url: values.avatar_url || null,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);
        
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="container mx-auto max-w-2xl px-4 py-8">
          <h1 className="mb-6 font-serif text-3xl font-bold">Your Profile</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="avatar_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </Form>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
