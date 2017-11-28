<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\Grant;

class CheckLoginForm
{
  public $tokenParamForm = 'access_token';
  public $tokenParamHeader = 'access-token';
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
    $token = '';
    if($request->header($this->tokenParamHeader)){
      $token = $request->header($this->tokenParamHeader);
    } else {
      $token = $request->input($this->tokenParamForm);
    }
    $grant = Grant::where('access_token', $token)->first();
    if ($grant !== null) {
      Auth::login($grant->user);
    }
    return $next($request);
  }
}