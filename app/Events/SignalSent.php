<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SignalSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $signalData;

    public function __construct($signalData)
    {
        $this->signalData = $signalData;
    }

    public function broadcastOn()
    {
        return ['video-call-channel'];
    }

    public function broadcastAs()
    {
        return 'signal';
    }
    
}
