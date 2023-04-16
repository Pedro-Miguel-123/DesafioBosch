Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  resources :devices
  post '/devices/:id/operate', to: 'devices#operate'
  # patch '/devices/:id', to: 'devices#update'
end
