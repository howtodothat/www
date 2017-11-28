<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\Grant;

class CheckLogin
{
  public $tokenParam = 'access-token';
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle($request, Closure $next)
  {
    // Check has Grant
    $grant = Grant::where('access_token', $request->header($this->tokenParam))->first();
    if ($grant !== null) {
      Auth::login($grant->user);
    }
    return $next($request);
  }
}