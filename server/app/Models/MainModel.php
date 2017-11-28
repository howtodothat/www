<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\MessageBag;

class MainModel extends Model
{
    // date out
    const DATE_FORMAT = "m/d/y";
    const DATE_LONG_FORMAT = "m/d/Y";
    const DATETIME_FORMAT = "m/d/y h:i A";
    // date in
    const DATE_FORMAT_DB = 'Y-m-d';
    const DATETIME_FORMAT_DB = 'Y-m-d H:i:s';
    // protected $dateFormat = 'U';

    protected $guarded = [];
    protected $encrypt = [];
    protected $upercase = [];
    protected $use_role;
    public $incrementing = false;
    // public $timestamps = true;
    public $errors;


    public function className()
    {
        return class_basename(static::class);
    }

    public function setFillable($params)
    {
        $this->fillable = $params;
    }
    /**
    * getAttribute pass by caster
    * @author thachhl
    * @param $key
    * @return attributes || parent::getAttribute
    */
    public function getAttributeNotCaster($key)
    {
        return parent::getAttribute($key);
    }
    /**
     * Before save
     *
     * @author HungVT <hungvt.itdng@gmail.com>
     */
    public function save(array $options = [])
    {
        // Before save

        if (empty($this->id)) {
            $this->id = uuid();
        }

        parent::save();
    }

    public function validate($ruleName = null)
    {
        if (!method_exists($this, 'rules')) {
            return true;
        }
        $rules = $this->rules($ruleName);
        $rules = is_null($ruleName) ? $rules : $rules[$ruleName];
        $this->use_role = $ruleName;
        $messages = [];
        $label_attr = [];
        if (method_exists($this, 'getMessagesValidate')) {
            $messages = $this->getMessagesValidate();
        }
        if (method_exists($this, 'setAttributeNames')) {
            $label_attr = $this->setAttributeNames();
        }
        $validate = Validator::make($this->attributes, $rules, $messages, $label_attr);
        if ($validate->fails()) {
            $this->errors = $validate->errors();
            return false;
        }
        return true;
    }

    /**
     * Adds a new error to the specified attribute.
     * @param string $attribute attribute name
     * @param string $error new error message
     */
    public function addError($attribute, $error = '')
    {
        if($this->errors===null) {
            $this->errors = new MessageBag();
        }
        $this->errors->add($attribute, $error);
    }

    /**
     * Returns a value indicating whether there is any validation error.
     * @param string|null $attribute attribute name. Use null to check all attributes.
     * @return boolean whether there is any error.
     */
    public function hasErrors($attribute = null)
    {
        return $attribute === null ? !empty($this->_errors) : isset($this->_errors[$attribute]);
    }

    public function fillByModel($request, $modelName = null)
    {
        if($modelName===false) {
            $this->fill($request->all());
        } else {
            if(is_null($modelName)){
                $params = $request->input($this->className());
                if(is_null($params)) {
                    $params = [];
                }
            } else {
                $params = $request->all();
            }
            $this->fill($params);
        }
    }

    public function getParam($request, $attribute)
    {
        $params = $request->input($this->className());
        if(is_null($params)) {
            return null;
        }
        return isset($params[$attribute]) ? $params[$attribute] : null;
    }

    public function searchArray($attr) {
        if (empty($attr)) {
            return true;
        }
    }

    public static function searchConditions($attributes = []) {
        $attributes = (array) $attributes;
        $arrConditions = [];

        if (empty($attributes)) {
            foreach ($attributes as $field => $val) {
                array_push($arrConditions, [$field, 'like' , $val]);
            }
        } else {
            foreach ($attributes as $field => $val) {
                if (!is_null(end($val))) {
                    if ($val[1] === 'like') {
                        $val[2] = "%{$val[2]}%";
                    }
                    array_push($arrConditions, $val);
                }
            }
        }
        return $arrConditions;
    }

    public function softDelete() {
        $this->deleted_at = $this->freshTimestamp();
        $this->save();
    }

    public function label($attribute) {
        $attributes = $this->attributeLabels();
        return $attributes[$attribute];
    }

    public function attrName($attribute, $multi=false) {
        if ($multi) {
            return $this->className() . "[{$attribute}][]";
        }
        return $this->className() . "[{$attribute}]";
    }

    public function hasRequest($request)
    {
        return !is_null($request->input($this->className()));
    }

    public function hasRelated($related)
    {
        return count($this->$related) !== 0;
    }

    public static function getTableName()
    {
        return with(new static)->getTable();
    }

}
