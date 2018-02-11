<?php
/**
 * Created by PhpStorm.
 * User: Arshad
 * Date: 09-Feb-18
 * Time: 2:43 PM
 */

namespace App\Controller;

use App\Form\SearchFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;



class homeController extends AbstractController
{
    public function index(Request $request=null, \App\Service\UserQuotationService $userQuotationService)
    {

        $form = $this->createForm(SearchFormType::class);

        $form->handleRequest($request);

        $errorMessage = "";

        if($form->isSubmitted() && $form->isValid())
        {
            $formData = $form->getData();

            $response = $userQuotationService->postUser($formData);
            if(isset($response['success']) && $response['success'] == true)
            {
                $age = date('Y')-date('Y',strtotime($formData['dob']));
                $gender = $formData['gender'];
                $name = $formData['firstname']." ".$formData['lastname'];


                $page = 1; //TODO add pagination support

                $quotes = json_decode($userQuotationService->getQuotes($gender,$age,$page));
                if(count($quotes) > 0)
                {

                    return $this->render('components/resultsContainer.html.twig',['results'=>$quotes,'userDetails'=>['name'=>$name,'gender'=>$gender,'age'=>$age]]);
                }
                else
                {
                    $errorMessage = "Sorry, we Could not find any results matching your age and gender";
                    return $this->render('components/searchContainer.html.twig',['searchForm'=>$form->createView(),'errorMessage'=>$errorMessage]);

                }

            }
            else
            {
                $errorMessage = "Errors in ". $response['errors'];
                return $this->render('components/searchContainer.html.twig',['searchForm'=>$form->createView(),'errorMessage'=>$errorMessage]);

            }
        }
        else{

            return $this->render('components/searchContainer.html.twig',['searchForm'=>$form->createView(),'errorMessage'=>$errorMessage]);
        }

    }

}