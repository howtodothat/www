<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\Grant;
class AuthToken
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
    $token = $request->header($this->tokenParam);
    if(empty($token)){
      $token = $request->input($this->tokenParam);
    }
    $grant = Grant::where('access_token', $token)->first();
    if (is_null($grant)) {
      return jsonOut(true, 403);
    } else {
      if($grant->validToken()) {
        $grant->update();
        Auth::login($grant->user);
      } else {
        return jsonOut(true, 403);
      }
    }

    return $next($request);
  }

}