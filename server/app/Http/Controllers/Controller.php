<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Contracts\View\Factory;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public $action;
    public $controller;
    public $module;
    protected $currentRoute;

    public function __construct() {
        $this->currentRoute = \Route::currentRouteAction();
        // Set Action name
        $this->setAction();
        // Set Controller name
        $this->setController();
        // Set Module name
        $this->setModule();
    }

    private function setAction()
    {
        $route = strtolower($this->currentRoute);
        if (strrpos($route, '@')!==false) {
            $this->action = substr($route, strrpos($route, '@')+1);
            if (stripos($this->currentRoute, $this->action)) {
                $this->action = ucfirst($this->action);
            }
        }
    }

    private function setController()
    {
        $route = strtolower($this->currentRoute);
        $namespace  = '\controllers\\';

        if (($beCon = strrpos($route, $namespace)) && ($enCon = strrpos($route, 'controller@'))) {
            $beCon += strlen($namespace);
            $this->controller = substr($route, $beCon, $enCon - $beCon);
            if (stripos($this->currentRoute, $this->controller)) {
                $this->controller = ucfirst($this->controller);
            }
        }
    }

    private function setModule() {
        $route = strtolower($this->currentRoute);
        $namespace  = '\modules\\';

        $beCon = strrpos($route, $namespace);
        if ($beCon !== false) {
            $lastStr = substr($route, $beCon + strlen($namespace));
            if (strpos($lastStr, '\\') !== false) {
                $this->module = substr($lastStr, 0, strpos($lastStr, '\\'));
                if (stripos($this->currentRoute, $this->module)) {
                    $this->module = ucfirst($this->module);
                }
            }
        }
    }

    public function render($view = null, $data = [], $mergeData = []) {
        $factory = app(Factory::class);
        $data['controller'] = $this;
        return $factory->make($this->getView($view), $data, $mergeData);
    }

    public function redirect($name=  'index', $data=  [])
    {
        $mold = is_null($this->module) ? '' : "{$this->module}.";
        $link = strtolower("{$mold}{$this->controller}.{$name}");

        if (strpos($name, '@') !== false) {
            $link = substr($name, strpos($name, '@')+1);
        }
        return redirect()->route($link, $data);
    }

    public function getView($view = null)
    {
        $nview = '';
        if (strpos($view, '@') === false) {
            // Add module
            if (is_string($this->module)) {
                $nview .= $this->module.'::';
            }
            // Add controller
            if (is_string($this->module)) {
                $nview .= $this->controller.'.';
            }
            // Add view
            if (is_null($view)) {
                $nview .= $this->action;
            } else {
                $nview .= $view;
            }
        } else {
            $nview = substr($view, strpos($view, '@')+1);
        }
        return $nview;
    }

    public function getRoute($name='index') {
        if (strpos($name, '@') === false) {
            $mod = is_null($this->module) ? '' : "{$this->module}.";
            return strtolower("{$mod}{$this->controller}.{$name}");
        } else {
            return substr($name, strpos($name, '@')+1);
        }
    }
}
