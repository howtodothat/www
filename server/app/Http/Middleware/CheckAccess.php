<?php

namespace App\Http\Middleware;

use Closure;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Modules\Permission\PermissionService;

class CheckAccess
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle($request, Closure $next)
  {
    $ps = new PermissionService;
    $access = $ps->canAccess();
    if (!$access) {
      return jsonOut(true, 401);
    }

    return $next($request);
  }
}


