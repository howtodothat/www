<?php
namespace App\Models;

use App\Models\MainModel;
use Carbon\Carbon;

class Medicare extends MainModel
{
    const IS_DELETED = 1;
    protected $table = 'medicares';

    /**
     * Set attr upercase.
     *
     * @var array
     */
    protected $upercase = [];
    /**
     * Set attr encrypt.
     *
     * @var array
     */
    protected $encrypt = [];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $date_to_date_out = ['calendar', 'dob'];
    protected $datetime_to_date_out = ['created_at', 'updated_at'];
    protected $date_fields_in = [];

    protected $fillable = [
        'id',
        'cin',
        'ssn',
        'firstname',
        'lastname',
        'calendar',
        'dob',
        'aid_code',
        'emergency_mc',
        'full_scope_mc',
    ];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [

    ];
    /**
  * The values of field.
  *
  * @var array
  */
    protected $casts = [
        'full_scope_mc' => 'integer',
        'emergency_mc' => 'integer',
    ];

    public function rules()
    {
        return [
            'insert' => [
                'cin' => 'required|string|max:15|unique:medicares,cin,NULL,id,deleted_at,NULL',
                'ssn' => 'required|string|max:15',// |unique:medicares,ssn,NULL,id,deleted_at,NULL
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'calendar' => 'date|required',
                'dob' => 'date|required',
                'aid_code' => 'string|max:15|nullable',
                'emergency_mc' => 'integer|nullable',
                'full_scope_mc' => 'integer|nullable',
                // 'created_by' => 'required|exist:users,id',
            ],
            'update' => [
                'id' => 'required|exists:medicares,id',
                'cin' => 'required|string|max:15|unique:medicares,cin,'.$this->id.',id,deleted_at,NULL',
                'ssn' => 'required|string|max:15',// |unique:medicares,ssn,'.$this->id.',id,deleted_at,NULL
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'calendar' => 'date|required',
                'dob' => 'date|required',
                'aid_code' => 'string|max:15|nullable',
                'emergency_mc' => 'integer|nullable',
                'full_scope_mc' => 'integer|nullable',
            ]
        ];
    }
    public function setAttributeNames()
    {
        return [
            'cin' => 'CIN',
            'ssn' => 'SSN',
            'firstname' => 'First Name',
            'lastname' => 'Last Name',
            'calendar' => 'Calendar',
            'dob' => 'Dob',
            'aid_code' => 'Aid Code',
            'emergency_mc' => 'Emergency MC',
            'full_scope_mc' => 'Full Scope MC',
        ];
    }

    /**
    * overwrite getAttribute to decrypt
    * @author thachhl
    * @param $key
    * @return attributes || parent::getAttribute
    */
    public function getAttribute($key)
    {
        if (!isset($this->attributes[$key])) {
            return parent::getAttribute($key);
        }
        if (in_array($key, $this->upercase) && $this->attributes[$key] != null) {
            return strtoupper($this->attributes[$key]);
        }
        return parent::getAttribute($key);
    }

    /**
    * overwrite attributesToArray to decrypt
    * @author thachhl
    * @return attributes
    */
    public function attributesToArray()
    {
        $attributes = parent::attributesToArray();
        foreach ($attributes as $key => $value) {
            if (in_array($key, $this->upercase) && !empty($value)) {
                $attributes[$key] = strtoupper($value);
            }
            if (in_array($key, $this->datetime_to_date_out) && !empty($value)) {
                $date = Carbon::createFromFormat(self::DATETIME_FORMAT_DB, $value);
                $attributes[$key] = $date->format(self::DATE_FORMAT);
            }
            if (in_array($key, $this->date_to_date_out) && !empty($value)) {
                $date = Carbon::createFromFormat(self::DATE_FORMAT_DB, $value);
                $attributes[$key] = $date->format(self::DATE_FORMAT);
                $attributes[$key.'_full'] = $value;
            }
        }
        return $attributes;
    }

    /**
    * overwrite setAttribute to uppser case and encrypt
    * @author thachhl
    * @param $key
    * @param $value
    * @return parent::setAttribute
    */
    public function setAttribute($key, $value)
    {
        if (in_array($key, $this->upercase)) {
                $value = strtoupper($value);
        }
        if (in_array($key, $this->encrypt) && $value != null) {
                $value = encryptString($value);
        }
        return parent::setAttribute($key, $value);
    }
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
