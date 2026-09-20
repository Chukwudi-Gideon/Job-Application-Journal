import {supabase  } from './supabase';
 
export async function getAnonymousUser(){
    const { data: { session}, } = await supabase.auth.getSession();
    if(session?.user){
        return session.user;
    };
    const { data, error} = await supabase.auth.signInAnonymously();
    if(error){
        console.error('Anonymous sign-in failed:', error);
        throw error;
    }
    return data.user
}


