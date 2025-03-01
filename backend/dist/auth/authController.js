"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const supabaseClient_1 = require("../supabaseClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function signup(req, res) {
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
        const { data: existingUser } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Insert user
        const { data: newUser, error: insertError } = await supabaseClient_1.supabase
            .from('users')
            .insert([{ email, password: hashedPassword }])
            .single();
        if (insertError) {
            res.status(400).json({ error: insertError.message });
            return;
        }
        res.status(201).json({ message: 'Signup successful', user: newUser });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }
        const { data: user, error: userError } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (userError || !user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Create JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ message: 'Login successful', token, user });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
