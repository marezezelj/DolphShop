import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: 'product-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new property for pagination
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElements:number=0;

  previousKeyword:string = "";
  

  constructor(private productService: ProductService, private cartService:CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

   
  }

  handleSearchProducts(){

    const theKeyword:string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previou then set thePageNumber=1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber=1;
    }

    this.previousKeyword=theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    this.productService.searchProductsPaginate(this.thePageNumber-1, this.thePageSize, theKeyword)
                                                .subscribe(this.processResult());

    /*
    this.productService.searchProducts(theKeyword).subscribe(
      data=>{
        this.products=data;
      }
    )
    */
  }

  handleListProducts() {
    //check ig id param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get id
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      //not category id available

      this.currentCategoryId = 1;
    }

    //
    // check if we have a different catergory then previous
    //Note: angular will reuse a componenet if it is currently being viewed

    //if we have a differecet id then previous then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`curentCategoryId=${this.currentCategoryId} , thePageNUmber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber -1 , this.thePageSize , this.currentCategoryId)
    .subscribe(this.processResult()
      /* reactoring
      data=>{
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number+1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
      */
    );

   // this.productService.getProductList(this.currentCategoryId).subscribe(
   //   data => {
   //     this.products = data;
   //   }
   // )
  }

  updatePageSize(pageSize:string){
    this.thePageSize=+pageSize;
    this.thePageNumber=1;
    this.listProducts();
  }

  processResult(){
    return (data:any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(theProduct: Product){

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
