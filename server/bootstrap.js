// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Lists.find().count() === 0) {
		var users = [
					{email:"registered@example.com",roles:[], profile: { name:"Registered User" }},
					{email:"blockCaptain@example.com",roles:['block-captain'], profile: { name:"Block Captain" }},
					{email:"controller@example.com",roles:['controller'], profile: { name:"Controller" }},
					{email:"controlCaptain@example.com",roles:['controller'], profile: { name:"Control Captain" }},
					{email:"cert@example.com",roles:['controller'], profile: { name:"Cert" }},
					{email:"admin@example.com",roles:['admin'], profile: { name:"Admin User" }},
					{email:"will@mckinleymedia.com",roles:['super-admin'], profile: {
						name:"Will McKinley",
						address:{
							streetNumber:"45",
							street:"Hickory"
						}
					}
					}
				],
			admin = createUsers(users);
    var blocks = [
			{
				name: 37,
				managers: [ admin ],
				street: "Hickory Ave",
				locations: [
					{ streetNumber: 13},
					{ streetNumber: 17},
					{ streetNumber: 21},
					{ streetNumber: 25},
					{ streetNumber: 29},
					{ streetNumber: 33},
					{ streetNumber: 34},
					{ streetNumber: 37},
					{ streetNumber: 41},
					{ streetNumber: 45,
						privacyLevel:"",
						interaction:[
							{ 
								 date:””,
								 status:”dataCollected"
							}
						],
						phone:"",
						equipment:{
							tools: "",
							bikes: "",
							motocycles: "",
							atvs: "",
							generators: "",
						},
						emergencyContact:[],
						pets:[
							{}
						],
						persons: [
							{
								name:"Will McKinley",
								userId:admin.id,
								gender:"",
								dob:"",
								birthYear:"",
								email:"",
								cellPhone:"",
								workPhone:"",
								specialNeeds:[],
								medicalConcerns:[],
								medicalKnowledge: [],
								otherKnowledge:[]
							},
							{
								name:"Wendy McKinley",
								dob:"",
								birthYear:"",
								cellPhone:"",
								workPhone:"",
								medicalConcerns:[]
							},
							{
								name:"Clara McKinley",
								dob:""
							},
							{
								name:"Nate McKinley",
								dob:""
							},
							{
								name:"Ben McKinley",
								dob:""
							}
						]
					},
					{ streetNumber: 49,
						privacy: "high"	
					},
					{ streetNumber: 53}
				]
      },
      {
      	name: 38,
				street: "Hickory Ave",
       	locations: [
					{ streetNumber: 3},
					{ streetNumber: 7},
					{ streetNumber: 9},
					{ streetNumber: 6},
					{ streetNumber: 10},
					{ streetNumber: 14},
					{ streetNumber: 18},
					{ streetNumber: 2, street:"Ash Ave"},
					{ streetNumber: 6, street:"Ash Ave"},
					{ streetNumber: 101, street:"Walnut Ave"},
					{ streetNumber: 103, street:"Walnut Ave"}
  			]
      },
      {
      	name: 39,
				street: "Walnut Ave",
       	locations: [
					{ streetNumber: 107},
					{ streetNumber: 109},
					{ streetNumber: 112},
					{ streetNumber: 113},
					{ streetNumber: 116},
					{ streetNumber: 117},
					{ streetNumber: 118},
					{ streetNumber: 120},
					{ streetNumber: 121},
					{ streetNumber: 139},
					{ streetNumber: 14, street:"Ash Ave"}
  			]
      }
    ];
    var event = {
			name:"Spring Drill",
			type:"drill",
			blocks=[
				{
					block_id:"",
					managersAvailable:["user_id"],
					status:"" //
					locations:[
						{
							location_id:"",
							sign:"Not visible",
							status:"No visible issues",
							contactWithResidents:"",
							activitiesPerformed:[
								"knocked on door",
								"phoned with out answer",
								"entered house"
							],
							problems:[
								"fire",
								"gas smell"
							],
							log:[
								{}
							],
							messages:[
								{}
							]
						}
					]
				}
			]
    };
		var createUsers = function(users){
			var admin;
			_.each(users, function (user) {
				var id;
				profile_id = Persons.insert({
						name: user.profile.name        
				});
				id = Accounts.createUser({
					email: user.email,
					password: "disaster1",
					profile: profile_id
				});
				if (user.profile.name == 'Will McKinley') admin = {id:id,name:user.profile.name};
				if (user.roles.length > 0) {
					// Need _id of existing user record so this call must come 
					// after `Accounts.createUser` or `Accounts.onCreate`
					Roles.addUsersToRoles(id, user.roles);
				}
			});
			return admin;
		};
		var createBlocks = function(blocks){
			var timestamp = (new Date()).getTime();
			_.each(blocks, function(block) {
				var street = block.locations[0].street || block.street,
					firstHouse = block.locations[0].streetNumber + " " + street,
					managers = block.managers || null;
					block_id = Lists.insert({
						name: block.name,
						managers: managers,
						firstHouse: firstHouse,
						incompleteCount: block.locations.length, // this should be number of houses visted - not event related
						completeCount: 0,
						alertCount: 0,        
					});

				_.each(block.locations, function(location) {
					Todos.insert({listId: block_id,
												text: location.streetNumber + " " + street,
												createdAt: new Date(timestamp)});
					timestamp += 1; // ensure unique timestamp.
				});
			});
    };
		var createFillerBlock = function(start,end){
			var filler = _.range(start,end+1),
				blocks=[];
			_.forEach(filler, function(block) {
					var newBlock = { 
						name: block,
						street: "Street",
						locations: [{ streetNumber: 1}]
					}
					blocks.push(newBlock);
			});
			createBlocks(blocks);
		}
    createFillerBlock(1,36);
    createBlocks(blocks);
    createFillerBlock(40,45);
  }
});
