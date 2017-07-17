<tr>
               <td>
                <div class=' col-md-1'>
                    <span class="label label-info pull-left">{{bidding.bidder.username}}</span>
                </div>
               </td>

               <td> 

               <td>
                <div class=' col-md-1'>
                    <span class="label label-info pull-left">{{bidding.num}}</span>
                </div>
               </td>

               <td>
                <div class=' col-md-1'>
                    <span class="price label label-info pull-left">{{bidding.price}}</span>
                </div>
               </td>
               {%if user.ismember%}
               <td>
               <button id = "{{bidding.id}}" onclick = 'accept_bid(this.id)'>接受交易</button>
               </td>
               {%endif%}
</tr>

