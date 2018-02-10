<?php

namespace App\Form;


use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use \Symfony\Component\Form\Extension\Core\Type\TextType;
use \Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use \Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Date;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;

class SearchFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('firstname',TextType::class,array('attr'=>['placeholder'=>'First Name',"columns"=>2,"icons"=>"user"]));
        $builder->add('lastname',TextType::class,array('attr'=>['placeholder'=>'Last Name',"columns"=>3,"icons"=>"user"]));
        $builder->add('email',EmailType::class,array('attr'=>['placeholder'=>'Email',"columns"=>3,"icons"=>"at"]));
        $builder->add('dob',TextType::class,array('attr'=>['placeholder'=>'DOB',"columns"=>2,"icons"=>"birthday-cake"],'constraints'=>[new NotBlank(),new Date()]));
        $builder->add('gender',ChoiceType::class,["choices"=>["Male"=>"m","Female"=>"f"],'attr'=>["columns"=>2,"icons"=>"male"]]);
        $builder->add('Search',SubmitType::class,['attr'=>['class'=>'btn btn-lg btn-success findQuotes pull-right']]);



    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            // uncomment if you want to bind to a class
            //'data_class' => SearchForm::class,
        ]);
    }
}
