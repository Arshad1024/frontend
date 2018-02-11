<?php
/**
 * Created by PhpStorm.
 * User: Arshad
 * Date: 10-Feb-18
 * Time: 9:12 AM
 */

namespace App\Service;


use GuzzleHttp\Exception\GuzzleException;

class UserQuotationService
{

    private $service;
    private $users;
    private $quotation;
    private $exception;

    public function __construct($client,$quotation,$users)
    {
        $this->service = $client;
        $this->quotation = $quotation;
        $this->users = $users;
    }

    public function postUser($data)
    {
        try {
            $response = $this->service->put($this->users, ['form_params' => $data]);
            return ['success'=>true];
        }
        catch (\Exception $e)
        {
            if($e->getCode() == 400 )
            {
                $headers = $e->getResponse()->getHeaders();
                return ['errors'=>implode(', ',$headers['X-Validation-Errors'])];
            }
            else if($e->getCode() == 503)
            {
                return ['errors'=>'Service Unavailable'];
            }
            else if($e->getCode() == 403)
            {
                return ['errors'=>'Sorry you do not have permission'];
            }
            else
            {
                return ['success'=>true];
            }
        }

    }

    public function getQuotes($gender,$age,$page=1)
    {

            return $this->service->get($this->quotation."/".$age."/".$gender."/".$page)->getBody()->getContents();

    }


}