module.exports = {
	updateList: function(list, key, item){
		if(_.find(list, {id: key })){
			var index = _.indexOf(list, _.find(list, {id: key }));
			list.splice(index, 1, item );
		}else{
			list.push(item)
		}
	}
}