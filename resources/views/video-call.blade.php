<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="user-id" content="{{ auth()->user()->id }}">
    <title>Video Call</title>
    @vite('resources/css/app.css')
    @vite('resources/js/video-call.js')
</head>
<body class="bg-gray-900 text-white flex items-center justify-center h-screen">
    <div id="video-call-container" class="flex flex-col items-center space-y-4">
        <!-- User Selection -->
        <div class="mb-4">
            <label for="receiverId" class="block text-lg mb-2">Select User to Call:</label>
            <select id="receiverId" class="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2">
                @foreach($users as $user)
                    <option value="{{ $user->id }}">{{ $user->name }}</option>
                @endforeach
            </select>
        </div>
        
        <div class="flex space-x-4">
            <video id="local-video" class="w-1/2 border border-gray-500" autoplay muted></video>
            <video id="remote-video" class="w-1/2 border border-gray-500" autoplay></video>
        </div>
        <div id="controls" class="flex space-x-4">
            <button id="start-call" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Start Call</button>
            <button id="end-call" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">End Call</button>
        </div>
    </div>

    <!-- Include Pusher JS -->
    <script src="https://js.pusher.com/7.0/pusher.min.js"></script>
</body>
</html>
