$(function(){
    
    submitLoginForm = (element) => {
        $.post( "/api/users/login", $( element ).serialize(), function(data){
            console.log(data)
        } )
    }
    
    $(document).on('submit', "#login-form", function(){
        submitLoginForm(this);

        return false;
    });
})

