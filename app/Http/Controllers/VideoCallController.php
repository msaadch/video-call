<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\SignalSent;
use App\Models\User;

class VideoCallController extends Controller
{
     public function __construct()
    {
        $this->middleware('auth');
    }
    public function index()
    {
        // Return the view for the video call page
        // return view('video-call');
        // $users = User::where('id', '!=', auth()->id())->get();
        $users = User :: where('id','!=',auth()->id())->get();
        // Pass the users to the view
        // return view('video-call', compact('users'));
        return view('video-call',compact('users'));
    }

    public function sendSignal(Request $request)
    {
        // Prepare and broadcast the signal data
        $signalData = $request->all();

        // Use the SignalSent event to broadcast the signal
        broadcast(new SignalSent($signalData))->toOthers();

        return response()->json(['Status' => 'Done signal']);
    }
    
    
}

