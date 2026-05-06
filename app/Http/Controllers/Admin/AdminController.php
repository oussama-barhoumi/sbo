<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $admins = User::whereIn('role', ['admin', 'super_admin'])->latest()->get();

        return Inertia::render('Admin/Admins/Index', [
            'admins' => $admins
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'role'  => 'required|in:admin,super_admin',
        ]);

        $user = User::where('email', $request->email)->first();
        $user->update(['role' => $request->role]);

        return back()->with('success', "{$user->name} is now an {$request->role}.");
    }

    public function update(Request $request, $id)
    {
        $request->validate(['role' => 'required|in:admin,super_admin']);
        
        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        return back()->with('success', "Role updated for {$user->name}.");
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->update(['role' => 'user']);

        return back()->with('success', "{$user->name} has been removed from admins.");
    }
}
