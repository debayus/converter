<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TextGroupController extends Controller
{
    public function index(){
        return view('textgroup.index');
    }
}
