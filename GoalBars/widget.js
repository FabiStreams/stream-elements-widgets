// DONATION BAR
var donation = 0; // Track overall donations
var goal = 0; // Overall goal
var goalSegments = 0; // Goal split into segments
var percent = doPercent( donation, goalSegments ); // Percentage of donations out of a current goal segment
var maxLevel = 10; // Maximum levels to break through
var fields;

//** LOAD IN INITIAL WIDGET DATA
//*
//*
window.addEventListener('onWidgetLoad', function (obj) {
  // Get base data
  let data = obj["detail"]["session"]["data"];
  const fieldData = obj["detail"]["fieldData"];
  fields = fieldData;  
  // Set initial goal data
  maxLevel = 1;
  goal = fieldData["amount"]; 
  goalSegments = setGoalSegments( goal );
  
  // Set goal live
  if ( '{goal_type}' == 'subscriber' && '{goal_period}' == 'goal' ) {    
    donation = data['{goal_type}-{goal_period}']['amount'];
    reloadGoal();   
  } else
    if ( '{goal_type}' == 'subscriber' && '{goal_period}' != 'goal' )  {    
    donation = data['{goal_type}-{goal_period}']['count'];
    reloadGoal();  
  } else       
    
  if ( '{goal_type}' == 'follower' && '{goal_period}' == 'goal' )  {   
    donation = data['{goal_type}-{goal_period}']['amount'];
    reloadGoal();   
  } else
    if ( '{goal_type}' == 'follower' && '{goal_period}' != 'goal' )  {     
    donation = data['{goal_type}-{goal_period}']['count'];
    reloadGoal();     
  } else      
    
  if ( '{goal_type}' == 'cheer' ) {
    donation = data['{goal_type}-{goal_period}']['amount'];
    reloadGoal();
  } else      
    
  if ( '{goal_type}' == 'tip' ) {
    donation = data['{goal_type}-{goal_period}']['amount'];
    reloadGoal();
  }    
});

//** UPDATE INFO WIDGET INFORMATION
//
//
window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const event = obj["detail"]["event"];

  if ( listener == '{goal_type}-latest' ) {
    if ( '{goal_type}' == 'subscriber') {
    donation = donation + 1;
    reloadGoal();
    } else
    if ( '{goal_type}' == 'follower') {
    donation = donation + 1;
    reloadGoal();
    } else   
    if ( '{goal_type}' == 'tip') {
    donation = donation + event["amount"];
    reloadGoal();
    } else
    if ( '{goal_type}' == 'cheer') {
    donation = donation + event["amount"];
    reloadGoal();
    } 
  }
});


//** CALCULATION FUNCTIONS FOR DONATIONS BAR
//
//
function reloadGoal() {
  // Set levels
  level = getLevel( donation, goal );
  // Figure out the correct multiplier for maths
  var subtract = 0;
  var multiplier = level-1;
  if ( multiplier > 0 ) {
  	subtract = goalSegments*multiplier;
  }
  // What's the current dono bar total, then?
  var donationAtLevel = donation-subtract;
  // Get goal segment amount
  $('#progress .endgame .amount').text( goalSegments );
  // Set percent
  percent = doPercent( donationAtLevel, goalSegments );
  // Update goal bar
  $('#progress .loading .amount').text( donationAtLevel.toFixed(0) );
  $('#progress .loading').css(  
    {
      'width': percent + '%'
    });
  $('#progress #current_level').text( level );
  $('#progress #current_goal').text( label );
}

function setGoalSegments( goal ) {
  var segment = goal / maxLevel;
  return segment.toFixed(0);
}

function getLevel( totalDonated, goal ) {
  var segment = setGoalSegments( goal );
  // Determine segment
  var level = 1;
  for (var cycle=1;cycle<=maxLevel;cycle++) {
    var cycleAmount = segment*cycle;
    if ( totalDonated >= cycleAmount ) {
      level = cycle+0;
    }
  }
  return level;
}

function doPercent( donated, goal ) {
  var perc = donated / goal;
  var amount = perc * 100;
  if ( amount < 10 ) {
    amount = 10;
  }
  if ( amount >= 100 ) {
    amount = 100;    
      $('#progress .loading').css(  
    {
      'background-color': '{loading_full_color}'
    });   
  }
  return amount;
}
