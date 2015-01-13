Crumbles::App.controllers :main do
    get :index, map: "/" do
      @dictionaries = Dictionary.all
      render "index"
    end

end

