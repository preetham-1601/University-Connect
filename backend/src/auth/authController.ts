import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }

    // Optional domain check
    // const domain = email.split('@')[1];
    // if (domain !== 'charlotte.edu' && domain !== 'methodist.edu') {
    //   res.status(400).json({ error: 'Only @charlotte.edu or @methodist.edu allowed' });
    //   return;
    // }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }])
      .single();

    if (insertError) {
      res.status(400).json({ error: insertError.message });
      return;
    }

    res.status(201).json({ message: 'Signup successful', user: newUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
