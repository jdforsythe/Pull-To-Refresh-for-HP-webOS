function FirstAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

FirstAssistant.prototype.setup = function() {

   // just to show that it's working
   this.refreshCount = 0;

   // DOM references
   this.scroller = this.controller.get("scroller");
   this.refreshBlock = this.controller.get("pullToRefresh");
   this.refreshText = this.controller.get("refreshText");
   this.refreshTime = this.controller.get("refreshTime");
   this.sceneContainer = this.controller.get("first-container");
   this.refreshArrow = this.controller.get("refreshArrow");
   
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
			this.refreshText.innerHTML = "Release to refresh...";
			this.refreshArrow.style["-webkit-transform"] = "rotate(180deg)";
		}.bind(this), 50);
		
	}
};

FirstAssistant.prototype.releaseScroll = function(event) {
	var scrollY = scroller.mojo.getScrollPosition().top;
	
	if(scrollY <= 20) {
		//webOS did the thing that doesn't let you hold the list past the regular scroll limit :(
		//Don't refresh because it's possible that it wasn't the user's intention to refresh...
	}
	
	//else if(document.getElementById("pullTxt").innerHTML == "Release to refresh.") {
	else {
	   // show the refresh block on the scene
	   this.refreshBlock.className = "vis";
	   
		// just show that it's working (you'd probably want to put a spinner here instead)
		this.refreshTime.innerHTML = '<div id="spinny"></div><span>Refreshing.. please wait..</span>';
		
		// instead of this setTimeout, you'd have the call to refresh your data and in the
		// final callback after the scene is updated, you'd call the "reset the refresh block" code below
		
		// wait to simulate a refreshing list
		setTimeout( function() {
		      var that = this;
            // set the refresh count (this is only so you can visibly see that it's refreshing)
		      this.refreshCount += 1;
		      this.sceneContainer.innerHTML = "Refreshes: " + this.refreshCount;

		      // reset the refresh block to invisible, reset the message, and set the refresh time
		      
		      // leave the refreshed message showing for .75 seconds after the time updates
		      setTimeout( function(){this.refreshBlock.className = "invis";}.bind(that), 750);
		      
		      this.refreshText.innerHTML = "Pull down to refresh...";
	         this.refreshTime.innerHTML = Date().toString();
	         this.refreshArrow.style["-webkit-transform"] = "rotate(0deg)";
		   }.bind(this),
		   2500 // wait 2.5 seconds for effect
		);
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
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
