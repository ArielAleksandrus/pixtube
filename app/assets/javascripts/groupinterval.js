// add an array of tags {start: xxx, end: xxx, ...}
// get the union of them.
function GroupInterval(arr){
	this.arr = globalUtils.helpers.clone(arr);
	this.iarr = [];
	this.sorted = false;

	this.binSearch = function(tuple){
		if(this.iarr.length == 0)
			return 0;
		var l = 0;
		var u = this.iarr.length - 1;
		var i = Math.floor((u - l) / 2);
		var prev = -1;
		while(this.iarr[i].start != tuple.start){
			if(this.iarr[i].start > tuple.start){
				u = i;
				i = l + Math.floor((u - l) / 2);
			} else {
				l = i;
				i = l + Math.ceil((u - l) / 2);
			}
			if(i == l && prev == u){
				if(this.iarr[i].start > tuple.start)
					return i;
				else
					return i+1;
			}
			prev = i;
		}
		return i;
  };
  this.sort = function() {
  	this.sorted = true;
  	var list = this.arr;
	  var gapSize = Math.floor( list.length / 2 );
		function _shellInsertionSort( list, gapSize ) {
		  var temp, i, j;

		  for( i = gapSize; i < list.length; i += gapSize ) {
		    j = i;
		    while( j > 0 && list[ j - gapSize ].start > list[j].start ) {
		      temp = list[j];
		      list[j] = list[ j - gapSize ];
		      list[ j - gapSize ] = temp;
		      j -= gapSize;
		    }
		  }
		};

	  while( gapSize > 0 ) {
	    _shellInsertionSort( list, gapSize );
	    gapSize = Math.floor( gapSize / 2 );
	  }

	  return list;
	};
	this.isIn = function(tupleInner, tupleOuter){
		return tupleInner.start >= tupleOuter.start && tupleInner.end <= tupleOuter.end;
	};
	this.add = function(tuple){
		var merged = false;
		var i = this.binSearch(tuple);

		if(!!this.iarr[i - 1] && this.isIn(tuple, this.iarr[i - 1])){
			return;
		}

		if(!!this.iarr[i - 1] && tuple.start <= this.iarr[i - 1].end){ //can merge.
			if(tuple.end > this.iarr[i - 1].end){
				this.iarr[i - 1].end = tuple.end;
			}
			tuple = this.iarr[i - 1];
			merged = true;
		}
		if(!!this.iarr[i] && tuple.end >= this.iarr[i].start){ //can merge.
			this.iarr[i].start = tuple.start;
			if(tuple.end > this.iarr[i].end){
				this.iarr[i].end = tuple.end;
			}
			if(merged){ //merge previous and current
				tuple.start = this.iarr[i-1].start;
				tuple.end = this.iarr[i].end;
				this.iarr.splice(i - 1, 2, tuple);
			} else {
				merged = true;
			}
		}
		if(!merged){
			this.iarr.splice(i, 0, tuple);
		}
	}
	this.process = function(){
		if(!this.sorted)
			this.sort();
		for(var i in this.arr){
			this.add(this.arr[i]);
		}
	}
	this.getResult = function(){
		return this.iarr;
	}
}