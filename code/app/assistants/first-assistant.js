function FirstAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

FirstAssistant.prototype.setup = function() {

   // just to show that it's working - you would not use this in your real app
   this.refreshCount = 0;
   
   // DOM reference to scene content container
   this.sceneContainer = this.controller.get("first-container");
   
   // setup pull to refresh
   this.setupPullToRefresh();
   

};

FirstAssistant.prototype.refreshContent = function() {
	   // show the refresh block on the scene and show the refreshing msg instead of the time
	   this.refreshBlock.className = "vis";
		this.refreshTime.innerHTML = this.refreshingMsg;
		
		
		// this is where you'd refresh your content (Ajax Requests, list items, etc) and in the FINAL CALLBACK
		// you'd call the this.finishedRefresh() method (don't forget to bind correctly)
		
		
		
		// to simulate a real refresh for the example, we'll use a setTimeout to keep the refresh
		// block on the scene for a couple seconds
		
		// wait to simulate a refreshing list
		setTimeout( function() {
		      var that = this; // binding
		      
            // set the refresh count (this is only so you can visibly see that it's refreshing)
            // this would not be in your typical app
		      this.refreshCount += 1;
		      this.sceneContainer.innerHTML = "Refreshes: " + this.refreshCount;

		      // we're done "refreshing" so reset the refresh block to invisible and set the time
		      that.finishedRefresh();

		   }.bind(this),
		   3000 // wait 3 sec for effect
		);
};

FirstAssistant.prototype.finishedRefresh = function() {

		      // leave the refreshed message showing for .75 seconds after the time updates
		      setTimeout( function(){this.refreshBlock.className = "invis";}.bind(this), 750);
		      
		      this.refreshText.innerHTML = this.pullDownMsg;
	         this.refreshTime.innerHTML = Date().toString();
	         this.refreshArrow.style["-webkit-transform"] = "rotate(0deg)";

};

FirstAssistant.prototype.setupPullToRefresh = function() {
   // messages to show
   this.pullDownMsg = "Pull Down to Refresh...";
   this.releaseMsg = "Release to Refresh...";
   this.refreshingMsg = '<div id="spinny"></div><span>Refreshing.. please wait..</span>';

   // DOM references
   this.scroller = this.controller.get("scroller");
   this.refreshBlock = this.controller.get("pullToRefresh");
   this.refreshText = this.controller.get("refreshText");
   this.refreshTime = this.controller.get("refreshTime");
   this.refreshArrow = this.controller.get("refreshArrow");
   
   // start the refresh text as the pull down message
   this.refreshText.innerHTML = this.pullDownMsg;
   
   // bindings
   this.scrollStarted = this.scrollStarted.bind(this);
   this.scrolling = this.scrolling.bind(this);
   this.releaseScroll = this.releaseScroll.bind(this);

   // setup scroller widget
	this.controller.setupWidget("scroller",
	   { mode: "vertical"},
	   {}
	);
};

FirstAssistant.prototype.scrollStarted = function(event) {
	Mojo.Event.listen(this.scroller, Mojo.Event.dragging, this.scrolling);
};

FirstAssistant.prototype.scrolling = function(event) {
	var scrollY = scroller.mojo.getScrollPosition().top;
	if(scrollY >= 65) {
	   // Make sure the user REALLY meant to refresh by making them hold it there for 50ms.
		setTimeout(function() {
			Mojo.Event.listen(this.scroller, "mouseup", this.releaseScroll);
			this.refreshText.innerHTML = this.releaseMsg;
			this.refreshArrow.style["-webkit-transform"] = "rotate(180deg)";
		}.bind(this), 50);
		
	}
};

FirstAssistant.prototype.releaseScroll = function(event) {
	var scrollY = scroller.mojo.getScrollPosition().top;
	
	if(scrollY <= 20) {
		//webOS did the thing that doesn't let you hold the list past the regular scroll limit :(
		//Don't refresh because it's possible that it wasn't the user's intention to refresh...
		// reset the message
		this.refreshText.innerHTML = this.pullDownMsg;
	}
	
   // otherwise it's a valid refresh
	else {
	
	   this.refreshContent();
	   
	}
	
	// whether it's a real refresh or not, remove the listeners
	Mojo.Event.stopListening(this.scroller, Mojo.Event.dragging, this.scrolling);
	Mojo.Event.stopListening(this.scroller, "mouseup", this.releaseScroll);
};

FirstAssistant.prototype.activate = function(event) {
   // listen for the user to start scrolling
	Mojo.Event.listen(this.scroller, Mojo.Event.scrollStarting, this.scrollStarted);
};

FirstAssistant.prototype.deactivate = function(event) {
   // stop listening to the scroller
	Mojo.Event.stopListening(this.scroller, Mojo.Event.scrollStarting, this.scrollStarted);
};

FirstAssistant.prototype.cleanup = function(event) {
};
