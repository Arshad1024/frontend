var SearchComponent = React.createClass({


    componentDidMount:function(){
        jQuery(function(){

            $(".form_datetime").datepicker({
                format: "yyyy-mm-dd"

            });

        });
    },

    addUser:function(){

       if(jQuery("#email").val() === "" || jQuery("#firstname").val() === "" || jQuery("#lastname").val() === "" || jQuery("#dob").val() === "")
       {
           jQuery("#searchValidationHolder").removeClass('hidden').addClass('alert-danger').html("Please fill all the form fields");
       }
       else {

           jQuery("#findQuotesButton").html("Please wait");

           var data = jQuery("#searchForm").serialize();

           var instance = this;
           jQuery.ajax({

               url:userApi+'/add',
               dataType:'json',
               type:'put',
               data:data,
               success:function(response){

                   console.log(response);
                   this.props.open(jQuery("#searchForm").serializeArray());
                   jQuery("#findQuotesButton").html("Find Quotes");
                   jQuery("#searchValidationHolder").addClass('hidden');


               }.bind(this),
               error:function(error){

                   if(error.status !== 409)
                   {
                       var message = JSON.parse(error.responseText);

                       jQuery("#findQuotesButton").html("Try Again");

                       jQuery("#searchValidationHolder").removeClass('hidden').addClass('alert-danger').html(message.message);
                   }
                   else
                   {
                       this.props.open(jQuery("#searchForm").serializeArray());
                       jQuery("#findQuotesButton").html("Find Quotes");
                       jQuery("#searchValidationHolder").addClass('hidden');
                   }


               }.bind(this)
           });

       }





    },
    render:function(){
        return (
            <div className="vertical-center">
                <div className="container wrapper">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-xl-12">
                            <form className="form-group" id={"searchForm"}>


                                <div className="row">

                                    <h2 className="center-block text-center">Find Insurance Policies</h2>

                                    <div id={"searchValidationHolder"} className="hidden alert">Test</div>


                                    <div className="input-group col-lg-2 pull-left">
                                        <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                        <input id="firstname" type="text" className="form-control input-lg" name="firstname" placeholder="First Name"></input>
                                    </div>

                                    <div className="input-group col-lg-3 pull-left">
                                        <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                        <input id="lastname" type="text" className="form-control input-lg" name="lastname" placeholder="Last Name"></input>
                                    </div>

                                    <div className="input-group col-lg-3 pull-left">
                                        <span className="input-group-addon"><i className="fa fa-at"></i></span>
                                        <input id="email" type="text" className="form-control input-lg" name="email" placeholder="Email"></input>
                                    </div>


                                    <div className="input-group col-lg-2 pull-left">
                                        <span className="input-group-addon"><i className="fa fa-birthday-cake"></i></span>
                                        <input id="dob" type="text" className="form-control form_datetime input-lg" name="dob" placeholder="Date of Birth"></input>
                                    </div>


                                    <div className="input-group col-lg-2 pull-left">
                                        <span className="input-group-addon"><i className="fa fa-male"></i></span>
                                        <select className="form-control input-lg" name={"gender"} id={"gender"}>

                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                        <span className="input-group-addon"><i className="fa fa-female"></i></span>
                                    </div>

                                    <div className="clearfix"></div>


                                </div>


                                <button id={"findQuotesButton"} type={"button"} className="btn btn-lg btn-success findQuotes pull-right" onClick={()=>this.addUser()}>Find Quotes</button>




                            </form>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
            );
            }

});


var ListingComponent = React.createClass({


    getInitialState:function(){

        return({name:"",lastname:"",gender:"",age:"",listing:"Loading..."})

    },

    componentDidMount:function(){

        var gender="";
        var age="";

        var instance = this;


        jQuery.each(this.props.data,function(i,v){

    if(v.name === "firstname")
        instance.setState({name:v.value});
    if(v.name === "lastname" )
        instance.setState({lastname:v.value});
    if(v.name === "dob" )
    {
        var formDate = new Date(v.value);

        var currentDate = new Date();
        age = (currentDate.getFullYear() - formDate.getFullYear());
        instance.setState({age:age});
    }
    if(v.name === "gender" )
    {
        instance.setState({gender:v.value});
        if(v.value === "Male")
            gender = "m";
        if(v.value === "Female")
        gender = "f";
    }

});

        jQuery.ajax({
            url:quotationApi+"/user/"+age+"/"+gender+"/1",
            dataType:'json',
            type:'get',
            success:function(response){

                if(response.length == 0)
                {
                   this.setState({listing:"Sorry, We could not find any matching results based on your age and gender"});
                }
                else
                {
                    var items = [];
                    jQuery.each(response,function(i,v){

                        items.push(<ListingElement data={v} />);

                    });

                    this.setState({listing:items});
                }
            }.bind(this),
            error:function(){}
        })


    },

   render:function(){


       return(<div className="vertical-center">
           <div className="container wrapper">
               <div className="row">

                   <div className="col-lg-2">
                       <strong>Name: </strong>{this.state.name} {this.state.lastname}<br/>
                       <strong>Gender: </strong>{this.state.gender}<br/>
                       <strong>Age: </strong>{this.state.age} Yrs Old<br/>
                       <button className={"btn btn-primary col-lg-12"} onClick={()=>this.props.close()}>New Search</button>
                   </div>
                   <div className="col-lg-10">
                       <h3 className="text-center">Search Results</h3>


                       {this.state.listing}


                   </div>
                   <div className="clearfix"></div>

               </div>
           </div>

           <div className="clearfix"></div>
       </div>);

   }

});


var MainApp = React.createClass({

    getInitialState:function(){

        return({component:<SearchComponent open={this.me} /> })

    },

    me:function(json){


        this.setState({component:<ListingComponent data={json} close={this.back} />});
    },

    back:function()
    {
        this.setState({component:<SearchComponent open={this.me} />});
    },

    render:function(){


        return(<div>{this.state.component}</div>)

    }




});


var ListingElement = React.createClass({


   render:function(){

       return(  <div className="col-lg-12 listing">
           <div className="row">

               <div className="col-lg-2 prices">
                   <strong>Annual Price</strong>
                   <h4>{this.props.data.price}</h4>

               </div>


               <div className="col-lg-10 upper">
                   <div className="row">

                       <div className="col-lg-3">
                           <strong className="center-block">CLINICS</strong>
                           <span className="center-block">{this.props.data.clinics}</span>
                       </div>
                       <div className="col-lg-3">
                           <strong className="center-block">HOSPITALS</strong>
                           <span className="center-block">{this.props.data.hospitals}</span>
                       </div>
                       <div className="col-lg-3">
                           <strong className="center-block">AMBULANCE</strong>
                           <span className="center-block">{this.props.data.ambulance}</span>
                       </div>
                       <div className="col-lg-3">
                           <strong className="center-block">CASH BENEFIT</strong>
                           <span className="center-block">{this.props.data.cash_benefit}</span>
                       </div>

                       <div className="clearfix"></div>
                   </div>

               </div>


               <div className="col-lg-10 lower">

                   <div className="row">

                       <div className="col-lg-8">

                           <div className="col-lg-3">
                               <strong className="center-block">PRESCRIPTION DRUGS</strong>
                               <span className="center-block">{this.props.data.prescription_drugs}</span>
                           </div>
                           <div className="col-lg-3">
                               <strong className="center-block">DENTAL</strong>
                               <span className="center-block">{this.props.data.dental}</span>
                           </div>
                           <div className="col-lg-3">
                               <strong className="center-block">EXCLUDED HOSPITALS</strong>
                               <span className="center-block">{this.props.data.excluded_hospitals}</span>
                           </div>
                           <div className="col-lg-3">
                               <strong className="center-block">DEDUCTABLE</strong>
                               <span className="center-block">{this.props.data.deductable}</span>
                           </div>

                       </div>

                       <div className="col-lg-4 coverage">
                           <h3>Annual Coverage</h3>
                           <h2>{this.props.data.annual_coverage}</h2>

                       </div>

                       <div className="clearfix"></div>

                   </div>

               </div>


           </div>
       </div>);

   }

});

ReactDOM.render(<MainApp  />,document.getElementById('app'));
