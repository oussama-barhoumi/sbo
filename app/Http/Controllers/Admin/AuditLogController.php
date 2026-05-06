<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
        $logs = AuditLog::with(['admin', 'targetUser'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/AuditLogs', [
            'logs' => $logs
        ]);
    }
}
