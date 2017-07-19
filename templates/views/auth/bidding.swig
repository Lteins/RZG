<tr>
     <td>
      <div class=' col-md-1'>
          <span class="label label-info pull-left">{{bidding.product.name}}</span>
      </div>
     </td>


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

     {%if !user.ismember%}
     <td>
     <button id = "{{bidding.id}}" onclick = 'recall_bid(this.id)'>取消交易</button>
     </td>
     {%endif%}
</tr>

