Rails.application.routes.draw do
  root to: 'home#getIndex'

  devise_for :usuarios, path: '', path_names: {
    sign_in: 'login', sign_out: 'logout', sign_up: 'criar_conta'
  }, controllers: {
    sessions: 'usuario/sessions'
  }

    # url for models that have unique-index attributes.
  unique_routing = Proc.new do
    collection do
      post :unique
    end
  end
  resources :usuarios, &unique_routing

  scope 'videos' do
    get '/', to: 'videos#list'
    get 'upload', to: 'videos#uploadIndex'
    post 'upload/send', to: 'videos#upload'
    post ':id/posterUpload', to: 'videos#posterUpload'
    post ':id/tagsUpload', to: 'videos#tagsUpload'
    get ':id/poster', to: 'videos#changePoster'
    get ':id/tags', to: 'videos#changeTags'
    post ':id/newTag', to: 'tags#newTag'
    get 'watch/:id', to: 'videos#watch'
  end

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
