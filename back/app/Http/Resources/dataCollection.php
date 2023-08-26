<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
// use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Collection;

class dataCollection extends Collection
{
    public static function toApiResponse(  $message = [], $data = [], bool $success = true) {
        return response()->json([
            "message" => $message,
            "data" => $data,
            'success' => $success,
        ]);
    }
}