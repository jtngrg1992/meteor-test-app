if (Meteor.isClient) {
    Template.register.events({
        'submit form': function(event) {
            event.preventDefault();
            var emailVar = event.target.registerEmail.value;
            var passwordVar = event.target.registerPassword.value; 
            Accounts.createUser({
                email:emailVar,
                password:passwordVar
            },function(err){
                if(err){
                    alert(err);
                    return false;;
                    return false;
                }
                else{
                    alert("Registered Successfully!")
                }
                
            });
            console.log("Form submitted.");
        },
        'click #change':function(){
           $('.login').fadeToggle();
           $('.register').fadeToggle();
       } 
    });
    
   
    
    Template.login.events({
        'submit form': function(event) {
            event.preventDefault();
            var emailVar = event.target.loginEmail.value;
            var passwordVar = event.target.loginPassword.value;  
            Meteor.loginWithPassword(emailVar, passwordVar,function(err){
                if(err){
                    alert(err);
                }
                else {
                    Session.set('user',emailVar)
                }
                
            });
            console.log("logged in ");
        },
         'click #change':function(){
           $('.login').fadeToggle();
           $('.register').fadeToggle();
       } 
    });
    
    Template.dashboard.events({
       'click .container-2 button':function(){
           event.preventDefault();
           Meteor.logout();
       },
       
       'mouseenter .post-single a':function(event){
           $('.comment').show();
           id=$(event.target).attr('id');
           Session.set('post_id',id);
           },
       
       'mouseleave .comment':function(){
           $('.comment').hide();
       },
       'click .comment button':function(){
          var com=$('.commentbox textarea').val()
          if(com==""){
            alert("Enter a comment first!");
            return;
          }
          var comment={
              post_id:id,
              comment:com,
              author:Meteor.user().emails[0].address
          };
          Comments.insert(comment);
        //   alert(JSON.stringify(comment))
       },
       
       'click .statusbox button':function(){
           var post={
               title:$('#post-title').val(),
               content:$('#post-content').val(),
               author:Meteor.user().emails[0].address,
               date:new Date()
           };
           Feeds.insert(post);
           location.reload();
       }
    });
    
    Template.dashboard.helpers({
        feeds:function(){
            return Feeds.find();
        },
        user:function(){
            return Meteor.user().emails[0].address;
        }
    });
    
    Template.comments.helpers({
       comments:function(){
           return Comments.find({post_id:Session.get('post_id')});
       }
    });
}

if(Meteor.isServer){
    Meteor.startup(function(){
        
        if(Feeds.find().count()==0){
            var posts=[
                {
                    title:"Test Post",
                    content:"This is post only for testing puposes",
                    author:"Jatin Garg",
                    likes:0,
                    comments_num:0,
                    comments:new Array(),
                    date: new Date()
                }
                     ];
            for (var i=0;i<posts.length;i++){
                Feeds.insert(posts[i]);
            }
        }
        console.log(Feeds.find())
    });
}