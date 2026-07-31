(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.LandscapeRelations=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const MALAL_TYPES=['fence','fort'];
  const CROP_TYPES=['corn','potato'];
  const CEREMONIAL_TYPES=['machi','lonko','rewe','kultrun','kuel','foye'];
  const WETLAND_FAUNA_TYPES=['swan','bandurria','frog'];

  // Euclidean grid distance is used because diagonal neighbours are genuinely
  // closer than objects separated by the same number of orthogonal steps.
  function gridDistance(a,b){
    return Math.hypot((a.i||0)-(b.i||0),(a.k||0)-(b.k||0));
  }

  function getObjectsByType(objects,type){
    return objects.filter(object=>object.type===type);
  }

  function getObjectsByCategory(objects,category){
    return objects.filter(object=>object.category===category);
  }

  function getNearbyObjects(objects,object,types,maxDistance){
    const accepted=Array.isArray(types)?types:[types];
    return objects.filter(candidate=>candidate!==object&&accepted.includes(candidate.type)&&gridDistance(object,candidate)<=maxDistance);
  }

  function isNear(objects,typeA,typeB,maxDistance){
    return getObjectsByType(objects,typeA).some(object=>getNearbyObjects(objects,object,typeB,maxDistance).length>0);
  }

  function isNearAny(objects,type,targetTypes,maxDistance){
    return getObjectsByType(objects,type).some(object=>getNearbyObjects(objects,object,targetTypes,maxDistance).length>0);
  }

  function countNearby(objects,type,targetType,maxDistance){
    return getObjectsByType(objects,type).reduce((total,object)=>total+getNearbyObjects(objects,object,targetType,maxDistance).length,0);
  }

  function nearestDistance(objects,object,types){
    const nearby=objects.filter(candidate=>candidate!==object&&(Array.isArray(types)?types:[types]).includes(candidate.type));
    return nearby.length?Math.min(...nearby.map(candidate=>gridDistance(object,candidate))):Infinity;
  }

  function evaluateMalalProtection(object,objects,maxDistance=2){
    const nearby=getNearbyObjects(objects,object,MALAL_TYPES,maxDistance);
    const score=nearby.length;
    return {state:score>=3?'protected':score>0?'partial':'unprotected',score,nearby};
  }

  function relation(object,id,state,details={}){
    return {object,id,state,...details};
  }

  function evaluateLandscapeRelations(objects){
    const relations=[];
    const add=(object,id,state,details)=>relations.push(relation(object,id,state,details));

    for(const object of objects){
      if(object.type==='ruka'){
        const distance=nearestDistance(objects,object,'water');
        add(object,'ruka-water',distance>=1&&distance<=4?'good':Number.isFinite(distance)?'suggestion':'missing',{distance});
      }

      if(object.type==='pudu'){
        const distance=nearestDistance(objects,object,'forest');
        add(object,'pudu-forest',distance<=2?'good':Number.isFinite(distance)?'suggestion':'missing',{distance});
      }

      if(['condor','puma','hawk'].includes(object.type)){
        const distance=nearestDistance(objects,object,['hill','volcano']);
        add(object,'wildlife-highlands',distance<=4?'good':Number.isFinite(distance)?'suggestion':'missing',{distance});
      }

      if(WETLAND_FAUNA_TYPES.includes(object.type)){
        const distance=nearestDistance(objects,object,['wetland','water']);
        add(object,'wetland-fauna',distance<=2?'good':Number.isFinite(distance)?'suggestion':'missing',{distance});
      }

      if(['chicken','camelid','hearth','metawe'].includes(object.type)){
        const distance=nearestDistance(objects,object,'ruka');
        add(object,'domestic-ruka',distance<=3?'good':Number.isFinite(distance)?'suggestion':'missing',{distance});
      }

      if([...CROP_TYPES,'chicken','camelid'].includes(object.type)){
        const protection=evaluateMalalProtection(object,objects);
        add(object,'malal-protection',protection.state==='protected'?'good':protection.state==='partial'?'progress':'suggestion',protection);
      }

      if(CROP_TYPES.includes(object.type)){
        const waterDistance=nearestDistance(objects,object,'water');
        const rukaDistance=nearestDistance(objects,object,'ruka');
        const protection=evaluateMalalProtection(object,objects);
        const water=waterDistance>=1&&waterDistance<=4;
        const ruka=rukaDistance<=3;
        const malal=protection.state!=='unprotected';
        const score=[water,ruka,malal].filter(Boolean).length;
        add(object,'crop-organization',score>=2?'good':score===1?'progress':'suggestion',{score,water,ruka,malal,waterDistance,rukaDistance,protection:protection.state});
      }

      if(CEREMONIAL_TYPES.includes(object.type)){
        const nearby=getNearbyObjects(objects,object,CEREMONIAL_TYPES,3);
        add(object,'ceremonial-cluster',nearby.length>=2?'good':nearby.length===1?'progress':'suggestion',{score:nearby.length,nearby});
      }
    }

    const summary={good:0,progress:0,suggestion:0,missing:0};
    relations.forEach(item=>summary[item.state]++);
    return {relations,summary};
  }

  function getRelationScore(object,relations){
    const values={good:2,progress:1,suggestion:0,missing:0};
    return relations.filter(item=>item.object===object).reduce((score,item)=>score+values[item.state],0);
  }

  return {
    MALAL_TYPES,CROP_TYPES,CEREMONIAL_TYPES,WETLAND_FAUNA_TYPES,
    gridDistance,getObjectsByType,getObjectsByCategory,getNearbyObjects,
    isNear,isNearAny,countNearby,evaluateMalalProtection,
    evaluateLandscapeRelations,getRelationScore
  };
});
